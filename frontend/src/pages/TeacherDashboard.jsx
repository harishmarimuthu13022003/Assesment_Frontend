import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import AssignmentList from '../components/teacher/AssignmentList'
import AssignmentForm from '../components/teacher/AssignmentForm'
import AssignmentDetails from '../components/teacher/AssignmentDetails'
import SubmissionsList from '../components/teacher/SubmissionsList'

const TeacherDashboard = () => {
  const { user, logout } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [showSubmissions, setShowSubmissions] = useState(false)

  useEffect(() => {
    fetchAssignments()
  }, [filter])

  const fetchAssignments = async () => {
    try {
      setLoading(true)
      const url = filter === 'all' ? '/api/assignments' : `/api/assignments?status=${filter}`
      const response = await axios.get(url)
      setAssignments(response.data)
    } catch (error) {
      toast.error('Failed to fetch assignments')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAssignment = async (assignmentData) => {
    try {
      const response = await axios.post('/api/assignments', assignmentData)
      toast.success('Assignment created successfully')
      setShowForm(false)
      fetchAssignments()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create assignment')
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.patch(`/api/assignments/${id}/status`, { status })
      toast.success('Status updated successfully')
      fetchAssignments()
      if (selectedAssignment?._id === id) {
        setSelectedAssignment({ ...selectedAssignment, status })
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      return
    }
    try {
      await axios.delete(`/api/assignments/${id}`)
      toast.success('Assignment deleted successfully')
      fetchAssignments()
      if (selectedAssignment?._id === id) {
        setSelectedAssignment(null)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete assignment')
    }
  }

  const handleViewSubmissions = (assignment) => {
    setSelectedAssignment(assignment)
    setShowSubmissions(true)
  }

  const getStats = () => {
    const total = assignments.length
    const draft = assignments.filter((a) => a.status === 'Draft').length
    const published = assignments.filter((a) => a.status === 'Published').length
    const completed = assignments.filter((a) => a.status === 'Completed').length
    return { total, draft, published, completed }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Total Assignments</div>
            <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Draft</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.draft}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Published</div>
            <div className="text-3xl font-bold text-blue-600">{stats.published}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('Draft')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'Draft'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Draft
            </button>
            <button
              onClick={() => setFilter('Published')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'Published'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setFilter('Completed')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'Completed'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            + Create Assignment
          </button>
        </div>

        {/* Content */}
        {showForm && (
          <AssignmentForm
            onSubmit={handleCreateAssignment}
            onCancel={() => setShowForm(false)}
          />
        )}

        {showSubmissions && selectedAssignment ? (
          <SubmissionsList
            assignment={selectedAssignment}
            onClose={() => {
              setShowSubmissions(false)
              setSelectedAssignment(null)
            }}
          />
        ) : selectedAssignment ? (
          <AssignmentDetails
            assignment={selectedAssignment}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
            onViewSubmissions={handleViewSubmissions}
            onClose={() => setSelectedAssignment(null)}
          />
        ) : (
          <AssignmentList
            assignments={assignments}
            loading={loading}
            onSelect={setSelectedAssignment}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
            onViewSubmissions={handleViewSubmissions}
          />
        )}
      </div>
    </div>
  )
}

export default TeacherDashboard

