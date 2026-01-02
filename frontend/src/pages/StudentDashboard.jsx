import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import AssignmentCard from '../components/student/AssignmentCard'
import SubmissionModal from '../components/student/SubmissionModal'

const StudentDashboard = () => {
  const { user, logout } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/assignments')
      setAssignments(response.data)
    } catch (error) {
      toast.error('Failed to fetch assignments')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (assignmentId, answer) => {
    try {
      await axios.post('/api/submissions', {
        assignmentId,
        answer,
      })
      toast.success('Answer submitted successfully')
      setShowSubmissionModal(false)
      setSelectedAssignment(null)
      fetchAssignments()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit answer')
    }
  }

  const checkSubmission = async (assignmentId) => {
    try {
      const response = await axios.get(`/api/submissions/assignment/${assignmentId}`)
      return response.data
    } catch (error) {
      return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Published Assignments
          </h2>
          <p className="text-gray-600">
            View and submit answers for published assignments
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading assignments...</div>
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-gray-600">No published assignments available</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <AssignmentCard
                key={assignment._id}
                assignment={assignment}
                onView={(assignment) => {
                  setSelectedAssignment(assignment)
                  setShowSubmissionModal(true)
                }}
                checkSubmission={checkSubmission}
              />
            ))}
          </div>
        )}

        {showSubmissionModal && selectedAssignment && (
          <SubmissionModal
            assignment={selectedAssignment}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowSubmissionModal(false)
              setSelectedAssignment(null)
            }}
            checkSubmission={checkSubmission}
          />
        )}
      </div>
    </div>
  )
}

export default StudentDashboard

