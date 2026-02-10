import { z } from 'zod';

export const userProfileSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  name: z.string().min(1).max(50),
  RZ_college: z.string().min(1), // Assuming validation against allowed list happens on frontend/db level or adds regex here
  semester: z.number().int().min(1).max(8),
  section: z.string().min(1).max(10),
});

export const voteSchema = z.object({
  spotId: z.string().min(1),
  type: z.enum(['upvote', 'downvote']),
});

export const attendanceSchema = z.object({
  courseId: z.string().min(1),
  status: z.enum(['attended', 'bunked']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
});
