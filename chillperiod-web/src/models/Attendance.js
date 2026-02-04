import mongoose from 'mongoose';

// Re-use the same schema as the Discord bot
const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, trim: true },
  totalClasses: { type: Number, default: 0 },
  attendedClasses: { type: Number, default: 0 }
});

const attendanceSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true },
  courses: [courseSchema],
  requiredPercentage: { type: Number, default: 75, min: 0, max: 100 },
  totalClasses: { type: Number, default: 0 },
  attendedClasses: { type: Number, default: 0 }
}, { timestamps: true });

// Virtual for percentage
attendanceSchema.virtual('percentage').get(function() {
  if (this.totalClasses === 0) return 100;
  return Math.round((this.attendedClasses / this.totalClasses) * 100 * 10) / 10;
});

// Virtual for safe to bunk
attendanceSchema.virtual('safeToBunk').get(function() {
  const { totalClasses, attendedClasses, requiredPercentage } = this;
  if (totalClasses === 0) return 0;
  const maxBunkable = Math.floor((attendedClasses * 100 / requiredPercentage) - totalClasses);
  return Math.max(0, maxBunkable);
});

// Virtual for need to attend
attendanceSchema.virtual('needToAttend').get(function() {
  const { totalClasses, attendedClasses, requiredPercentage } = this;
  if (totalClasses === 0) return 0;
  const currentPercentage = (attendedClasses / totalClasses) * 100;
  if (currentPercentage >= requiredPercentage) return 0;
  const needed = Math.ceil((requiredPercentage * totalClasses - 100 * attendedClasses) / (100 - requiredPercentage));
  return Math.max(0, needed);
});

// Get status
attendanceSchema.methods.getStatus = function() {
  const percentage = this.percentage;
  const required = this.requiredPercentage;
  const safeToBunk = this.safeToBunk;
  const needToAttend = this.needToAttend;
  
  if (percentage >= required + 10) {
    return { status: 'safe', message: `You can safely bunk ${safeToBunk} more classes!`, color: 'green' };
  } else if (percentage >= required) {
    return { status: 'caution', message: safeToBunk > 0 ? `You can bunk ${safeToBunk} more, be careful!` : 'Attend the next class!', color: 'yellow' };
  } else {
    return { status: 'danger', message: `Attend ${needToAttend} more classes to reach ${required}%!`, color: 'red' };
  }
};

attendanceSchema.methods.recalculateTotals = function() {
  this.totalClasses = this.courses.reduce((sum, c) => sum + c.totalClasses, 0);
  this.attendedClasses = this.courses.reduce((sum, c) => sum + c.attendedClasses, 0);
};

export default mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
