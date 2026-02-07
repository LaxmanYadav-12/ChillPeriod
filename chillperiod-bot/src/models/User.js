import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    // Discord info
    discordId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    username: {
        type: String,
        required: true
    },
    
    // College/Location
    college: {
        id: String,
        name: String,
        city: String
    },
    
    // Stats
    stats: {
        spotsAdded: {
            type: Number,
            default: 0
        },
        reviewsWritten: {
            type: Number,
            default: 0
        },
        postsCreated: {
            type: Number,
            default: 0
        }
    },

    // Attendance stats (Moved to root for easier access)
    totalClasses: { type: Number, default: 0 },
    attendedClasses: { type: Number, default: 0 },
    totalBunks: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },

    // Courses & Attendance
    courses: [{
        name: { type: String, required: true },
        code: String,
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
    }]
}, {
    timestamps: true
});

// Calculate current attendance percentage
userSchema.virtual('attendancePercentage').get(function() {
    if (this.totalClasses === 0) return 100;
    return Math.round((this.attendedClasses / this.totalClasses) * 100);
});

// Calculate how many classes can be skipped (Global) 
// Note: It's better to calculate this per course, but this gives a rough idea
userSchema.virtual('safeToSkip').get(function() {
    const { totalClasses, attendedClasses } = this;
    const requiredPercentage = 75; // Default global target
    if (totalClasses === 0) return 0;
    
    const minAttended = Math.ceil((requiredPercentage / 100) * totalClasses);
    return Math.max(0, attendedClasses - minAttended);
});

// Get bunk title based on total bunks
userSchema.methods.getBunkTitle = function() {
  const bunks = this.totalBunks;
  if (bunks >= 100) return { title: 'Bunk Legend', emoji: '👑' };
  if (bunks >= 50) return { title: 'Bunk King', emoji: '🏆' };
  if (bunks >= 25) return { title: 'Serial Skipper', emoji: '😴' };
  if (bunks >= 10) return { title: 'Chill Master', emoji: '😎' };
  if (bunks >= 5) return { title: 'Casual Bunker', emoji: '🌴' };
  return { title: 'Rookie', emoji: '🌱' };
};

// Helper to get status for a single course
userSchema.methods.getCourseStatus = function(course) {
    const percentage = course.totalClasses > 0 ? (course.attendedClasses / course.totalClasses) * 100 : 100;
    const required = course.targetPercentage || 75;
    
    // Safe to bunk calculation for this specific course
    // (attended / (total + x)) >= required/100
    // x <= (attended * 100 / required) - total
    const safeToBunk = Math.max(0, Math.floor((course.attendedClasses * 100 / required) - course.totalClasses));
    
    // Need to attend
    // (attended + x) / (total + x) >= required/100
    // x >= (required * total - 100 * attended) / (100 - required)
    const needToAttend = Math.max(0, Math.ceil((required * course.totalClasses - 100 * course.attendedClasses) / (100 - required)));

    if (percentage >= required + 10) return { status: 'safe', color: 0x10B981, emoji: '🟢', message: `Safe! Can bunk ${safeToBunk} more.`, safeToBunk };
    if (percentage >= required) return { status: 'caution', color: 0xF59E0B, emoji: '🟡', message: `Careful! Can bunk ${safeToBunk} more.`, safeToBunk };
    return { status: 'danger', color: 0xEF4444, emoji: '🔴', message: `Danger! Attend ${needToAttend} classes!`, needToAttend };
};

export default mongoose.model('User', userSchema);
