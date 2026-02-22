import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = session.user.id.toString();

  // Ensure DB connection is established
  await dbConnect();

  // Create highly customized readable stream
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection establishment
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode('data: {"connected": true}\n\n'));

      // 1. Setup MongoDB Change Stream watcher
      // This allows Vercel serverless functions to natively listen to database inserts
      // without needing in-memory event emitters that don't scale across instances.
      const pipeline = [
        { 
          $match: { 'fullDocument.userId': session.user.id } // Only listen to notifications for this user
        }
      ];

      // Note: MongoDB Atlas supports watch() on models out of the box
      const changeStream = Notification.watch(pipeline);

      changeStream.on('change', (change) => {
         if (change.operationType === 'insert') {
            try {
              controller.enqueue(encoder.encode('data: {"newNotification": true}\n\n'));
            } catch (err) {
              console.error('SSE enqueue error:', err);
            }
         }
      });

      changeStream.on('error', (err) => {
         console.error('changeStream error:', err);
      });

      // 2. Keep connection alive with heartbeats to prevent 504 timeouts
      const heartbeatInterval = setInterval(() => {
          try {
              controller.enqueue(encoder.encode(':\n\n'));
          } catch (err) {
              clearInterval(heartbeatInterval);
          }
      }, 30000); // 30 seconds

      // 3. Cleanup logic when client disconnects
      request.signal.addEventListener('abort', async () => {
        clearInterval(heartbeatInterval);
        try {
          await changeStream.close();
        } catch(e) {}
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
