import api from '../utils/axios'

export const getAllTasks = async () => {
  return api.get('/tasks/get-all-task')
}

export const getTaskById = async (taskId) => {
  return api.get(`/tasks/get-task/${taskId}`)
}

export const createTask = async (taskData) => {
  return api.post('/tasks/add-new-task', taskData)
}

export const updateTask = async (taskId, taskData) => {
  return api.put(`/tasks/update-task/${taskId}`, taskData)
}

export const deleteTask = async (taskId) => {
  return api.delete(`/tasks/delete-task/${taskId}`)
}

export const getTaskSuggestions = async () => {
  return api.get('/users/get-task-suggestions')
}