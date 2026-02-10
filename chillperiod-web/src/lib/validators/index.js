import { z } from 'zod';



export const voteSchema = z.object({
  spotId: z.string().min(1),
  type: z.enum(['upvote', 'downvote']),
});

export const attendanceSchema = z.object({
  courseId: z.string().min(1),
  status: z.enum(['attended', 'bunked']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
});
