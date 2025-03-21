import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTasks } from '../hooks/useTasks'

const TaskDetails = () => {
  const { id } = useParams()
  const { fetchTask, removeTask, loading } = useTasks()
  const [task, setTask] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadTask()
  }, [id])

  const loadTask = async () => {
    try {
      const taskData = await fetchTask(id)
      if (taskData) {
        setTask(taskData)
      } else {
        setError('Task not found')
      }
    } catch (err) {
      setError('Failed to load task')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const deleted = await removeTask(id)
      if (deleted) {
        navigate('/')
      }
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  if (!task) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="text-primary-600 hover:text-primary-800">
          &larr; Back to Dashboard
        </Link>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <div className="flex space-x-2">
            <Link 
              to={`/tasks/${id}/edit`}
              className="btn btn-secondary"
            >
              Edit
            </Link>
            <button 
              onClick={handleDelete}
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority || 'No priority'}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
            {task.status || 'No status'}
          </span>
          {task.dueDate && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{task.description}</p>
        </div>

        {task.createdAt && (
          <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500">
            Created: {new Date(task.createdAt).toLocaleString()}
            {task.updatedAt && task.updatedAt !== task.createdAt && (
              <span className="ml-4">
                Last updated: {new Date(task.updatedAt).toLocaleString()}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskDetails