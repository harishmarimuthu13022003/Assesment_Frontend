import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const SubmissionsList = ({ assignment, onClose }) => {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubmissions()
  }, [assignment._id])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/assignments/${assignment._id}/submissions`)
      setSubmissions(response.data)
    } catch (error) {
      toast.error('Failed to fetch submissions')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkReviewed = async (submissionId) => {
    try {
      await axios.patch(`/api/submissions/${submissionId}/review`)
      toast.success('Submission marked as reviewed')
      fetchSubmissions()
    } catch (error) {
      toast.error('Failed to mark as reviewed')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Submissions for: {assignment.title}
          </h2>
          <p className="text-gray-600">
            Total Submissions: {submissions.length}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-600">Loading submissions...</div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-600">No submissions yet</div>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {submission.student.name}
                  </h3>
                  <p className="text-sm text-gray-600">{submission.student.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Submitted: {new Date(submission.createdAt).toLocaleString()}
                  </p>
                  {submission.reviewed && (
                    <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      Reviewed
                    </span>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer:
                </label>
                <p className="text-gray-800 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                  {submission.answer}
                </p>
              </div>
              {!submission.reviewed && (
                <button
                  onClick={() => handleMarkReviewed(submission._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                >
                  Mark as Reviewed
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SubmissionsList

