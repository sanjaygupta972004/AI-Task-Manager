import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTasks } from '../hooks/useTasks'
import TaskForm from '../components/shared/TaskForm'

const EditTask = () => {
  const { id } = useParams()
  const { fetchTask, editTask, loading } = useTasks()
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

  const handleSubmit = async (taskData) => {
    const updatedTask = await editTask(id, taskData)
    if (updatedTask) {
      navigate(`/tasks/${id}`)
    }
  }

  if (loading && !task) {
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to={`/tasks/${id}`} className="text-primary-600 hover:text-primary-800">
          &larr; Back to Task
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Edit Task</h1>
      
      <div className="card">
        <TaskForm 
          initialValues={task} 
          onSubmit={handleSubmit} 
          buttonText="Update Task" 
        />
      </div>
    </div>
  )
}

export default EditTask