import mongoose from 'mongoose';

const spotSchema = new mongoose.Schema({
    // Basic info
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    description: {
        type: String,
        trim: true,
        maxLength: 500
    },
    
    // Location
    college: {
        type: String,
        required: true,
        index: true
    },
    address: {
        type: String,
        trim: true
    },
    coordinates: {
        lat: Number,
        lng: Number
    },
    distance: {
        type: String,  // e.g., "5 min walk", "500m"
        trim: true
    },
    
    // Categories
    category: {
        type: String,
        required: true,
        enum: ['cafe', 'restaurant', 'library', 'park', 'arcade', 'mall', 'other'],
        index: true
    },
    
    // Attributes
    vibe: {
        type: String,
        enum: ['quiet', 'social', 'both'],
        default: 'both'
    },
    budget: {
        type: String,
        enum: ['free', 'cheap', 'moderate', 'expensive'],
        default: 'moderate'
    },
    bestFor: {
        type: String,  // e.g., "quick snack", "study session", "hangout"
        trim: true
    },
    avgTime: {
        type: String,  // e.g., "30-60 min"
        trim: true
    },
    
    // Community data
    addedBy: {
        discordId: String,
        username: String
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    voters: [{
        odId: String,
        vote: { type: Number, enum: [-1, 1] }
    }],
    
    // Status
    verified: {
        type: Boolean,
        default: false
    },
    reported: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for efficient queries
spotSchema.index({ college: 1, category: 1 });
spotSchema.index({ college: 1, vibe: 1 });
spotSchema.index({ college: 1, budget: 1 });

// Virtual for score
spotSchema.virtual('score').get(function() {
    return this.upvotes - this.downvotes;
});

export default mongoose.model('Spot', spotSchema);
