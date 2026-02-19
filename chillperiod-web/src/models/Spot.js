import mongoose from 'mongoose';

// Re-use the same schema as the Discord bot
const spotSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxLength: 100 },
  description: { type: String, trim: true, maxLength: 500 },
  college: { type: String, required: true, index: true },
  address: { type: String, trim: true },
  coordinates: { lat: Number, lng: Number },
  distance: { type: String, trim: true },
  googleMapsUrl: { type: String, trim: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['cafe', 'restaurant', 'street_food', 'park', 'shopping', 'gaming', 'sweet_shop', 'library', 'other', 'arcade', 'mall'], 
    index: true 
  },
  vibe: { type: String, enum: ['quiet', 'social', 'productive', 'romantic', 'late_night', 'nature', 'both'], default: 'both' },
  budget: { type: String, enum: ['free', 'broke', 'cheap', 'moderate', 'expensive', 'luxury'], default: 'moderate' },
  bestFor: { type: String, trim: true },
  avgTime: { type: String, trim: true },
  addedBy: { discordId: String, username: String },
  checkins: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: String,
    userImage: String,
    checkedInAt: { type: Date, default: Date.now }
  }],
  reports: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, enum: ['closed', 'inaccurate', 'spam', 'inappropriate', 'other'], required: true },
    detail: { type: String, maxLength: 300 },
    createdAt: { type: Date, default: Date.now }
  }],
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: String,
    userImage: String,
    rating: { type: Number, min: 1, max: 5, required: true },
    text: { type: String, maxLength: 300 },
    createdAt: { type: Date, default: Date.now }
  }],
  avgRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  reportCount: { type: Number, default: 0 },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  reported: { type: Boolean, default: false }
}, { timestamps: true });

spotSchema.virtual('score').get(function() {
  return this.upvotes - this.downvotes;
});

export default mongoose.models.Spot || mongoose.model('Spot', spotSchema);
