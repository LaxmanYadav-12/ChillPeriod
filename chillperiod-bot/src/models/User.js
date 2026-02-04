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
    
    // Attendance tracking
    attendance: {
        totalClasses: {
            type: Number,
            default: 0
        },
        attendedClasses: {
            type: Number,
            default: 0
        },
        requiredPercentage: {
            type: Number,
            default: 75  // Most colleges require 75%
        }
    },
    
    // Preferences
    preferences: {
        defaultVibe: {
            type: String,
            enum: ['quiet', 'social', 'both'],
            default: 'both'
        },
        defaultBudget: {
            type: String,
            enum: ['free', 'cheap', 'moderate', 'expensive', 'any'],
            default: 'any'
        }
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
    }
}, {
    timestamps: true
});

// Calculate current attendance percentage
userSchema.virtual('attendancePercentage').get(function() {
    if (this.attendance.totalClasses === 0) return 100;
    return Math.round((this.attendance.attendedClasses / this.attendance.totalClasses) * 100);
});

// Calculate how many classes can be skipped
userSchema.virtual('safeToSkip').get(function() {
    const { totalClasses, attendedClasses, requiredPercentage } = this.attendance;
    if (totalClasses === 0) return 0;
    
    // Calculate minimum classes needed to maintain required percentage
    // attended / (total + x) >= required/100
    // Solve for x (classes that can be skipped)
    const minAttended = Math.ceil((requiredPercentage / 100) * totalClasses);
    return Math.max(0, attendedClasses - minAttended);
});

export default mongoose.model('User', userSchema);
