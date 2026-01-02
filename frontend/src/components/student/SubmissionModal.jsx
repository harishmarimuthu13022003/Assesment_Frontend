import { useState, useEffect } from 'react'

const SubmissionModal = ({ assignment, onSubmit, onClose, checkSubmission }) => {
  const [answer, setAnswer] = useState('')
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadSubmission()
  }, [assignment._id])

  const loadSubmission = async () => {
    const sub = await checkSubmission(assignment._id)
    setSubmission(sub)
    if (sub) {
      setAnswer(sub.answer)
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!answer.trim()) {
      return
    }
    setSubmitting(true)
    await onSubmit(assignment._id, answer)
    setSubmitting(false)
  }

  const isOverdue = new Date(assignment.dueDate) < new Date()
  const canEdit = !submission && !isOverdue

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{assignment.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Due: {new Date(assignment.dueDate).toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description:
            </label>
            <p className="text-gray-800 whitespace-pre-wrap bg-gray-50 p-4 rounded">
              {assignment.description}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Answer {submission && '(Submitted)'}:
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={!canEdit}
                rows={8}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  canEdit ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                }`}
                placeholder="Enter your answer here..."
              />
              {submission && (
                <p className="text-sm text-gray-600 mt-2">
                  Submitted on: {new Date(submission.createdAt).toLocaleString()}
                </p>
              )}
              {isOverdue && !submission && (
                <p className="text-sm text-red-600 mt-2">
                  Submission deadline has passed
                </p>
              )}
            </div>

            <div className="flex gap-4">
              {canEdit && (
                <button
                  type="submit"
                  disabled={submitting || !answer.trim()}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Answer'}
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
              >
                {submission ? 'Close' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SubmissionModal

