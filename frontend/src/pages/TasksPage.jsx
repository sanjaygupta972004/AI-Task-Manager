import { useNavigate } from 'react-router-dom'
import { useTasks } from '../hooks/useTasks'
import TaskForm from '../components/tasks/TaskFrom'

const CreateTask = () => {
  const { addTask, loading } = useTasks()
  const navigate = useNavigate()

  const handleSubmit = async (taskData) => {
    const newTask = await addTask(taskData)
    if (newTask) {
      navigate(`/tasks/${newTask.id}`)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Task</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="card">
          <TaskForm onSubmit={handleSubmit} buttonText="Create Task" />
        </div>
      )}
    </div>
  )
}

export default CreateTask