import api from '../utils/axios'

export const loginUser = async (credentials) => {
  return api.post('/users/signin', credentials)
}

export const registerUser = async (userData) => {
  return api.post('/users/signup', userData)
}

export const logoutUser = async () => {
  return api.get('/users/signout')
}

export const getCurrentUser = async () => {
  return api.get('/users/get-user-profile')
}

export const updateUserProfile = async (userId, userData) => {
  return api.patch(`/users/update-user-profile/c/${userId}`, userData)
}

export const deleteUserAccount = async () => {
  return api.delete('/users/delete-user-profile')
}

export const getAllUsers = async () => {
  return api.get('/users/get-all-users')
}