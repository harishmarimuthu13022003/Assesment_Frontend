const AssignmentList = ({
  assignments,
  loading,
  onSelect,
  onUpdateStatus,
  onDelete,
  onViewSubmissions,
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Loading assignments...</div>
      </div>
    )
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <div className="text-gray-600">No assignments found</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => (
        <div
          key={assignment._id}
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition cursor-pointer"
          onClick={() => onSelect(assignment)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {assignment.title}
              </h3>
              <p className="text-gray-600 mb-3 line-clamp-2">
                {assignment.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>
                  Due: {new Date(assignment.dueDate).toLocaleString()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                  {assignment.status}
                </span>
              </div>
            </div>
            <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
              {assignment.status === 'Draft' && (
                <>
                  <button
                    onClick={() => onUpdateStatus(assignment._id, 'Published')}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => onDelete(assignment._id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </>
              )}
              {assignment.status === 'Published' && (
                <>
                  <button
                    onClick={() => onViewSubmissions(assignment)}
                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition"
                  >
                    View Submissions
                  </button>
                  <button
                    onClick={() => onUpdateStatus(assignment._id, 'Completed')}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                  >
                    Mark Completed
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AssignmentList

