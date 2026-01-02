import { useState } from 'react'

const AssignmentDetails = ({
  assignment,
  onUpdateStatus,
  onDelete,
  onViewSubmissions,
  onClose,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'Published':
        return 'bg-blue-100 text-blue-800'
      case 'Completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{assignment.title}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <p className="text-gray-800 whitespace-pre-wrap">{assignment.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <p className="text-gray-800">
              {new Date(assignment.dueDate).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}
            >
              {assignment.status}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Created At
          </label>
          <p className="text-gray-800">
            {new Date(assignment.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          {assignment.status === 'Draft' && (
            <>
              <button
                onClick={() => onUpdateStatus(assignment._id, 'Published')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Publish Assignment
              </button>
              <button
                onClick={() => onDelete(assignment._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete Assignment
              </button>
            </>
          )}
          {assignment.status === 'Published' && (
            <>
              <button
                onClick={() => onViewSubmissions(assignment)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                View Submissions
              </button>
              <button
                onClick={() => onUpdateStatus(assignment._id, 'Completed')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Mark as Completed
              </button>
            </>
          )}
          {assignment.status === 'Completed' && (
            <button
              onClick={() => onViewSubmissions(assignment)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              View Submissions
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssignmentDetails

