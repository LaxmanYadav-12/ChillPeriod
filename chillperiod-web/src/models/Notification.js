import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { 
    type: String, 
    enum: ['follow', 'bunk', 'class_alert', 'mass_bunk', 'bunk_join'], 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  read: { type: Boolean, default: false },
  metadata: { type: Object }, // Store subject, originalBunkerId, etc.
}, { timestamps: true });

// Compound index for efficient queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });

// Auto-delete notifications older than 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
