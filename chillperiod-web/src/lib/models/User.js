import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // Auth identifiers
  email: { type: String, unique: true, sparse: true },
  discordId: { type: String, unique: true, sparse: true },
  googleId: { type: String, unique: true, sparse: true },
  
  // Profile info
  name: { type: String, required: true },
  username: { type: String, unique: true, sparse: true },
  image: String,
  college: String,
  semester: Number,
  section: String,
  
  // Social
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Stats
  totalClasses: { type: Number, default: 0 },
  attendedClasses: { type: Number, default: 0 },
  totalBunks: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  
  // Favorite spot
  favoriteSpot: {
    name: String,
    emoji: String
  },
  
  // Settings
  isPublic: { type: Boolean, default: true },
  notificationsEnabled: { type: Boolean, default: true },
  targetPercentage: { type: Number, default: 75 },
  hasCompletedOnboarding: { type: Boolean, default: false },
  
  // Courses & Attendance
  courses: [{
    name: { type: String, required: true },
    code: String,
    type: { type: String, enum: ['Theory', 'Lab'], default: 'Theory' },
    totalClasses: { type: Number, default: 0 },
    attendedClasses: { type: Number, default: 0 },
    targetPercentage: { type: Number, default: 75 }
  }],
  
  attendanceLog: [{
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    actions: [{
      courseId: { type: mongoose.Schema.Types.ObjectId, required: true },
      status: { type: String, enum: ['attended', 'bunked'], required: true },
      timestamp: { type: Date, default: Date.now }
    }]
  }],

}, { timestamps: true });

// Virtuals for computed fields
UserSchema.virtual('attendancePercentage').get(function() {
  if (this.totalClasses === 0) return 100;
  return Math.round((this.attendedClasses / this.totalClasses) * 100);
});

UserSchema.virtual('followerCount').get(function() {
  return this.followers?.length || 0;
});

UserSchema.virtual('followingCount').get(function() {
  return this.following?.length || 0;
});

// Get bunk title based on total bunks
UserSchema.methods.getBunkTitle = function() {
  const bunks = this.totalBunks;
  if (bunks >= 100) return { title: 'Bunk Legend', emoji: '👑' };
  if (bunks >= 50) return { title: 'Bunk King', emoji: '🏆' };
  if (bunks >= 25) return { title: 'Serial Skipper', emoji: '😴' };
  if (bunks >= 10) return { title: 'Chill Master', emoji: '😎' };
  if (bunks >= 5) return { title: 'Casual Bunker', emoji: '🌴' };
  return { title: 'Rookie', emoji: '🌱' };
};

// Ensure virtuals are included in JSON
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

// Prevent Mongoose caching stale schema in development
if (process.env.NODE_ENV === 'development' && mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.models.User || mongoose.model('User', UserSchema);
