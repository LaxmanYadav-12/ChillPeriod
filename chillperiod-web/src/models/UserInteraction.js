import mongoose from 'mongoose';

const userInteractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  spotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Spot', required: true, index: true },
  type: { type: String, enum: ['upvote', 'downvote', 'report'], required: true },
}, { timestamps: true });

// Prevent multiple interactions of same type per user per spot
userInteractionSchema.index({ userId: 1, spotId: 1, type: 1 }, { unique: true });

export default mongoose.models.UserInteraction || mongoose.model('UserInteraction', userInteractionSchema);
