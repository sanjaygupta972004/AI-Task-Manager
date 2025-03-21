import React from 'react'
import Card from '../ui/Card'
import Button from '../ui/Button'
const TaskItem = ({ task, onEdit, onDelete }) => {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  }
  
  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }
  
  const isPastDue = () => {
    if (!task.dueDate) return false
    const now = new Date()
    const dueDate = new Date(task.dueDate)
    return dueDate < now && task.status !== 'completed'
  }
  
  return (
    <Card className={`mb-4 ${isPastDue() ? 'border-l-4 border-red-500' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${priorityColors[task.priority]}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${statusColors[task.status]}`}>
            {task.status === 'in_progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Due: {formatDate(task.dueDate)}
            {isPastDue() && (
              <span className="ml-2 text-red-600 font-medium">Past due!</span>
            )}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(task.id)}
            className="text-blue-600 hover:bg-blue-50"
          >
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default TaskItem