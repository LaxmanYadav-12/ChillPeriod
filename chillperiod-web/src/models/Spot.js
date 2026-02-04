import mongoose from 'mongoose';

// Re-use the same schema as the Discord bot
const spotSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxLength: 100 },
  description: { type: String, trim: true, maxLength: 500 },
  college: { type: String, required: true, index: true },
  address: { type: String, trim: true },
  coordinates: { lat: Number, lng: Number },
  distance: { type: String, trim: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['cafe', 'restaurant', 'library', 'park', 'arcade', 'mall', 'other'],
    index: true 
  },
  vibe: { type: String, enum: ['quiet', 'social', 'both'], default: 'both' },
  budget: { type: String, enum: ['free', 'cheap', 'moderate', 'expensive'], default: 'moderate' },
  bestFor: { type: String, trim: true },
  avgTime: { type: String, trim: true },
  addedBy: { discordId: String, username: String },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  reported: { type: Boolean, default: false }
}, { timestamps: true });

spotSchema.virtual('score').get(function() {
  return this.upvotes - this.downvotes;
});

export default mongoose.models.Spot || mongoose.model('Spot', spotSchema);
