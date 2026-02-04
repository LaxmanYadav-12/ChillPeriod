import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        trim: true
    },
    totalClasses: {
        type: Number,
        default: 0
    },
    attendedClasses: {
        type: Number,
        default: 0
    }
});

const attendanceSchema = new mongoose.Schema({
    // Discord user info
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
    
    // Courses (like BunkMate - per course tracking)
    courses: [courseSchema],
    
    // Overall settings
    requiredPercentage: {
        type: Number,
        default: 75,  // Most colleges require 75%
        min: 0,
        max: 100
    },
    
    // Quick totals (calculated from courses)
    totalClasses: {
        type: Number,
        default: 0
    },
    attendedClasses: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Calculate overall attendance percentage
attendanceSchema.virtual('percentage').get(function() {
    if (this.totalClasses === 0) return 100;
    return Math.round((this.attendedClasses / this.totalClasses) * 100 * 10) / 10;
});

// Calculate how many classes can be safely bunked
attendanceSchema.virtual('safeToBunk').get(function() {
    const { totalClasses, attendedClasses, requiredPercentage } = this;
    if (totalClasses === 0) return 0;
    
    // Formula: How many can be bunked while staying above required%
    // (attended / (total + x)) >= required/100
    // Solving: x <= (attended * 100 / required) - total
    const maxBunkable = Math.floor((attendedClasses * 100 / requiredPercentage) - totalClasses);
    return Math.max(0, maxBunkable);
});

// Calculate how many classes need to attend to reach required%
attendanceSchema.virtual('needToAttend').get(function() {
    const { totalClasses, attendedClasses, requiredPercentage } = this;
    if (totalClasses === 0) return 0;
    
    const currentPercentage = (attendedClasses / totalClasses) * 100;
    if (currentPercentage >= requiredPercentage) return 0;
    
    // Formula: How many consecutive classes to attend to reach required%
    // (attended + x) / (total + x) >= required/100
    // Solving: x >= (required * total - 100 * attended) / (100 - required)
    const needed = Math.ceil((requiredPercentage * totalClasses - 100 * attendedClasses) / (100 - requiredPercentage));
    return Math.max(0, needed);
});

// Get status emoji and message
attendanceSchema.methods.getStatus = function() {
    const percentage = this.percentage;
    const required = this.requiredPercentage;
    const safeToBunk = this.safeToBunk;
    const needToAttend = this.needToAttend;
    
    if (percentage >= required + 10) {
        return {
            emoji: '🟢',
            status: 'Safe Zone',
            message: `You can safely bunk ${safeToBunk} more class${safeToBunk !== 1 ? 'es' : ''}!`,
            color: 0x10B981 // Green
        };
    } else if (percentage >= required) {
        return {
            emoji: '🟡',
            status: 'Caution Zone',
            message: safeToBunk > 0 
                ? `You can bunk ${safeToBunk} more class${safeToBunk !== 1 ? 'es' : ''}, but be careful!`
                : 'Attend the next class to stay safe!',
            color: 0xF59E0B // Amber
        };
    } else {
        return {
            emoji: '🔴',
            status: 'Danger Zone',
            message: `Attend ${needToAttend} more class${needToAttend !== 1 ? 'es' : ''} to reach ${required}%!`,
            color: 0xEF4444 // Red
        };
    }
};

// Recalculate totals from courses
attendanceSchema.methods.recalculateTotals = function() {
    this.totalClasses = this.courses.reduce((sum, c) => sum + c.totalClasses, 0);
    this.attendedClasses = this.courses.reduce((sum, c) => sum + c.attendedClasses, 0);
};

export default mongoose.model('Attendance', attendanceSchema);
