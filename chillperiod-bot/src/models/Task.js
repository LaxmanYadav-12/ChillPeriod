import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxLength: 200
  },
  description: { 
    type: String, 
    trim: true,
    maxLength: 1000,
    default: ''
  },
  completed: { 
    type: Boolean, 
    default: false,
    index: true
  },
  dueDate: { 
    type: Date,
    index: true
  },
  priority: { 
    type: String, 
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  tags: { 
    type: [String], 
    default: [] 
  },
  subjectLink: { 
    type: String, 
    default: ''
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { 
  timestamps: true 
});

TaskSchema.index({ userId: 1, completed: 1, dueDate: 1 });

export default mongoose.models?.Task || mongoose.model('Task', TaskSchema);
