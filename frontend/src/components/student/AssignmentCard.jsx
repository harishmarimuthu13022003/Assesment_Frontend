import { useState, useEffect } from 'react'

const AssignmentCard = ({ assignment, onView, checkSubmission }) => {
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubmission()
  }, [assignment._id])

  const loadSubmission = async () => {
    const sub = await checkSubmission(assignment._id)
    setSubmission(sub)
    setLoading(false)
  }

  const isOverdue = new Date(assignment.dueDate) < new Date()
  const canSubmit = !submission && !isOverdue

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800 flex-1">
          {assignment.title}
        </h3>
        {submission && (
          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">
            Submitted
          </span>
        )}
        {isOverdue && !submission && (
          <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded font-medium">
            Overdue
          </span>
        )}
      </div>
      <p className="text-gray-600 mb-4 line-clamp-3">{assignment.description}</p>
      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <span>Due: {new Date(assignment.dueDate).toLocaleString()}</span>
      </div>
      <button
        onClick={() => onView(assignment)}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-lg transition ${
          canSubmit
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : submission
            ? 'bg-gray-200 text-gray-700'
            : 'bg-red-200 text-red-700 cursor-not-allowed'
        }`}
      >
        {loading
          ? 'Loading...'
          : submission
          ? 'View Submission'
          : isOverdue
          ? 'Submission Closed'
          : 'Submit Answer'}
      </button>
    </div>
  )
}

export default AssignmentCard

