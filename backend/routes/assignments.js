const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const { auth, isTeacher } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/assignments
// @desc    Get assignments (filtered by role and status)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (req.user.role === 'student') {
      // Students can only see Published assignments
      query.status = 'Published';
    } else if (req.user.role === 'teacher') {
      // Teachers see their own assignments, optionally filtered by status
      query.teacher = req.user._id;
      if (status && ['Draft', 'Published', 'Completed'].includes(status)) {
        query.status = status;
      }
    }

    const assignments = await Assignment.find(query)
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/assignments/:id
// @desc    Get single assignment
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('teacher', 'name email');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Students can only view Published assignments
    if (req.user.role === 'student' && assignment.status !== 'Published') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Teachers can only view their own assignments
    if (req.user.role === 'teacher' && assignment.teacher._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(assignment);
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/assignments
// @desc    Create new assignment
// @access  Private (Teacher only)
router.post(
  '/',
  auth,
  isTeacher,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('dueDate').isISO8601().withMessage('Valid due date is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, dueDate } = req.body;

      const assignment = new Assignment({
        title,
        description,
        dueDate,
        teacher: req.user._id,
        status: 'Draft',
      });

      await assignment.save();
      await assignment.populate('teacher', 'name email');

      res.status(201).json(assignment);
    } catch (error) {
      console.error('Create assignment error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/assignments/:id
// @desc    Update assignment
// @access  Private (Teacher only)
router.put(
  '/:id',
  auth,
  isTeacher,
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('dueDate').optional().isISO8601().withMessage('Valid due date is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const assignment = await Assignment.findById(req.params.id);

      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }

      // Check ownership
      if (assignment.teacher.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Cannot edit Completed assignments
      if (assignment.status === 'Completed') {
        return res.status(400).json({ message: 'Cannot edit completed assignments' });
      }

      // Cannot edit Published assignments (only status can be changed)
      if (assignment.status === 'Published') {
        return res.status(400).json({ message: 'Cannot edit published assignments. Only status can be changed.' });
      }

      const { title, description, dueDate } = req.body;
      if (title) assignment.title = title;
      if (description) assignment.description = description;
      if (dueDate) assignment.dueDate = dueDate;

      await assignment.save();
      await assignment.populate('teacher', 'name email');

      res.json(assignment);
    } catch (error) {
      console.error('Update assignment error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PATCH /api/assignments/:id/status
// @desc    Update assignment status
// @access  Private (Teacher only)
router.patch(
  '/:id/status',
  auth,
  isTeacher,
  [body('status').isIn(['Draft', 'Published', 'Completed']).withMessage('Invalid status')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const assignment = await Assignment.findById(req.params.id);

      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }

      // Check ownership
      if (assignment.teacher.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const { status } = req.body;

      // Validate state transitions
      if (assignment.status === 'Completed' && status !== 'Completed') {
        return res.status(400).json({ message: 'Cannot change status of completed assignment' });
      }

      assignment.status = status;
      await assignment.save();
      await assignment.populate('teacher', 'name email');

      res.json(assignment);
    } catch (error) {
      console.error('Update status error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE /api/assignments/:id
// @desc    Delete assignment
// @access  Private (Teacher only)
router.delete('/:id', auth, isTeacher, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check ownership
    if (assignment.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Cannot delete Published or Completed assignments
    if (assignment.status !== 'Draft') {
      return res.status(400).json({ message: 'Can only delete draft assignments' });
    }

    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/assignments/:id/submissions
// @desc    Get all submissions for an assignment
// @access  Private (Teacher only)
router.get('/:id/submissions', auth, isTeacher, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check ownership
    if (assignment.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const submissions = await Submission.find({ assignment: req.params.id })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

