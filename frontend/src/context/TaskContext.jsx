import { createContext, useState, useEffect } from 'react'
import { 
  getAllTasks, 
  createTask, 
  getTaskById, 
  updateTask, 
  deleteTask,
  getTaskSuggestions
} from '../services/taskService'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

export const TaskContext = createContext()

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const { isAuthenticated } = useAuth()

  // Fetch tasks when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks()
    }
  }, [isAuthenticated])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const tasksData = await getAllTasks()
      setTasks(tasksData)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const fetchTaskSuggestions = async () => {
    try {
      setLoading(true)
      const suggestionsData = await getTaskSuggestions()
      setSuggestions(suggestionsData)
      return suggestionsData
    } catch (error) {
      console.error('Failed to fetch task suggestions:', error)
      toast.error('Failed to load task suggestions')
      return []
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (taskData) => {
    try {
      setLoading(true)
      const newTask = await createTask(taskData)
      setTasks(prevTasks => [...prevTasks, newTask])
      toast.success('Task created successfully!')
      return newTask
    } catch (error) {
      toast.error('Failed to create task')
      return null
    } finally {
      setLoading(false)
    }
  }

  const fetchTask = async (taskId) => {
    try {
      setLoading(true)
      return await getTaskById(taskId)
    } catch (error) {
      console.error('Failed to fetch task:', error)
      toast.error('Failed to load task details')
      return null
    } finally {
      setLoading(false)
    }
  }

  const editTask = async (taskId, taskData) => {
    try {
      setLoading(true)
      const updatedTask = await updateTask(taskId, taskData)
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? updatedTask : task
        )
      )
      toast.success('Task updated successfully!')
      return updatedTask
    } catch (error) {
      toast.error('Failed to update task')
      return null
    } finally {
      setLoading(false)
    }
  }

  const removeTask = async (taskId) => {
    try {
      setLoading(true)
      await deleteTask(taskId)
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
      toast.success('Task deleted successfully!')
      return true
    } catch (error) {
      toast.error('Failed to delete task')
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        suggestions,
        fetchTasks,
        addTask,
        fetchTask,
        editTask,
        removeTask,
        fetchTaskSuggestions
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}