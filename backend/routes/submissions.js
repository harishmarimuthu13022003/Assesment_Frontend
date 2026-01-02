const express = require('express');
const { body, validationResult } = require('express-validator');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const { auth, isStudent, isTeacher } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/submissions
// @desc    Submit answer for an assignment
// @access  Private (Student only)
router.post(
  '/',
  auth,
  isStudent,
  [
    body('assignmentId').notEmpty().withMessage('Assignment ID is required'),
    body('answer').trim().notEmpty().withMessage('Answer is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { assignmentId, answer } = req.body;

      // Check if assignment exists and is Published
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }

      if (assignment.status !== 'Published') {
        return res.status(400).json({ message: 'Can only submit answers to published assignments' });
      }

      // Check if due date has passed
      if (new Date(assignment.dueDate) < new Date()) {
        return res.status(400).json({ message: 'Submission deadline has passed' });
      }

      // Check if student already submitted
      const existingSubmission = await Submission.findOne({
        assignment: assignmentId,
        student: req.user._id,
      });

      if (existingSubmission) {
        return res.status(400).json({ message: 'You have already submitted an answer for this assignment' });
      }

      // Create submission
      const submission = new Submission({
        assignment: assignmentId,
        student: req.user._id,
        answer,
      });

      await submission.save();
      await submission.populate('student', 'name email');
      await submission.populate('assignment', 'title description dueDate');

      res.status(201).json(submission);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: 'You have already submitted an answer for this assignment' });
      }
      console.error('Submit answer error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET /api/submissions/assignment/:assignmentId
// @desc    Get student's submission for an assignment
// @access  Private
router.get('/assignment/:assignmentId', auth, async (req, res) => {
  try {
    let submission;

    if (req.user.role === 'student') {
      // Students can only see their own submission
      submission = await Submission.findOne({
        assignment: req.params.assignmentId,
        student: req.user._id,
      })
        .populate('assignment', 'title description dueDate status')
        .populate('student', 'name email');
    } else if (req.user.role === 'teacher') {
      // Teachers can see all submissions for their assignments
      const assignment = await Assignment.findById(req.params.assignmentId);
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' });
      }

      if (assignment.teacher.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const submissions = await Submission.find({ assignment: req.params.assignmentId })
        .populate('student', 'name email')
        .populate('assignment', 'title description dueDate status')
        .sort({ createdAt: -1 });

      return res.json(submissions);
    }

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/submissions/my-submissions
// @desc    Get all submissions by current student
// @access  Private (Student only)
router.get('/my-submissions', auth, isStudent, async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .populate('assignment', 'title description dueDate status')
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error('Get my submissions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/submissions/:id/review
// @desc    Mark submission as reviewed
// @access  Private (Teacher only)
router.patch('/:id/review', auth, isTeacher, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id).populate('assignment');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check if teacher owns the assignment
    if (submission.assignment.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    submission.reviewed = true;
    await submission.save();
    await submission.populate('student', 'name email');
    await submission.populate('assignment', 'title description dueDate status');

    res.json(submission);
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

