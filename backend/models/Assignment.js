const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Completed'],
    default: 'Draft',
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
assignmentSchema.index({ teacher: 1, status: 1 });
assignmentSchema.index({ status: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);

