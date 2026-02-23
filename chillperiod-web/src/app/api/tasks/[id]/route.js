import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectMongo from '@/lib/mongodb';
import Task from '@/models/Task';

// Helper to verify task ownership
async function getTaskIfOwner(taskId, sessionUserId) {
  const task = await Task.findById(taskId);
  if (!task) {
    return { error: 'Task not found', status: 404 };
  }
  // Allow owner or collaborator to interact (you can refine this logic if collaborators are read-only)
  const isOwner = task.userId.toString() === sessionUserId;
  const isCollaborator = task.collaborators?.some(id => id.toString() === sessionUserId);
  
  if (!isOwner && !isCollaborator) {
    return { error: 'Unauthorized', status: 403 };
  }
  return { task };
}

// UPDATE an existing task
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;

    await connectMongo();
    
    const { task, error, status } = await getTaskIfOwner(id, session.user.id);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    const updateData = await request.json();
    
    // Only allow updating allowed fields
    const allowedFields = ['title', 'description', 'completed', 'dueDate', 'priority', 'tags', 'subjectLink', 'collaborators'];
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        task[field] = updateData[field];
      }
    });

    // Special parsing for dates
    if (updateData.dueDate !== undefined) {
      task.dueDate = updateData.dueDate ? new Date(updateData.dueDate) : null;
    }

    const updatedTask = await task.save();
    
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('collaborators', 'name username image discordId avatar');

    return NextResponse.json(populatedTask, { status: 200 });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a task
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = await params;

    await connectMongo();
    
    // We only allow the OWNER to delete, not collaborators
    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    if (task.userId.toString() !== session.user.id) {
       return NextResponse.json({ error: 'Only the task creator can delete it' }, { status: 403 });
    }

    await Task.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
