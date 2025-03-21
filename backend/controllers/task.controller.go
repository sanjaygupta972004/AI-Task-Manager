package controllers

import (
	"ai-task-manager/models"
	"ai-task-manager/utils"
	"ai-task-manager/websocket"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TaskController interface {
	CreateTask(c *gin.Context)
	GetTask(c *gin.Context)
	GetAllTasks(c *gin.Context)
	UpdateTask(c *gin.Context)
	DeleteTask(c *gin.Context)
	ChangeStatusTask(c *gin.Context)
}

type taskController struct {
	db *gorm.DB
}

func NewTaskController(db *gorm.DB) TaskController {
	return &taskController{
		db: db,
	}
}

func (t *taskController) CreateTask(c *gin.Context) {
	var task models.Task

	userID, err := utils.GetUserIdFromHeader(c)
	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Error: get userID from header", err.Error())
		return
	}

	uuidUserID, err := utils.IsUUID(userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Error: convert userID into UUID", err.Error())
		return
	}
	task.UserID = uuidUserID
	if err := c.ShouldBindJSON(&task); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}

	if err := t.db.Create(&task).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Error creating task", err.Error())
		return
	}

	taskJSON, _ := json.Marshal(task)
	websocket.Manager.BroadcastMessage(taskJSON)

	utils.SuccessResponse(c, http.StatusCreated, "Task created successfully", task)
}

func (t *taskController) GetTask(c *gin.Context) {
	taskID := c.Param("taskID")
	uuidTaskID, err := utils.IsUUID(taskID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Error: convert taskID into UUID", err.Error())
		return
	}
	var task models.Task
	if err := t.db.First(&task, "task_id = ?", uuidTaskID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Task not found", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Task retrieved successfully", task)
}

func (t *taskController) GetAllTasks(c *gin.Context) {
	var tasks []models.Task
	if err := t.db.Find(&tasks).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Error retrieving tasks", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Tasks retrieved successfully", tasks)
}

func (t *taskController) UpdateTask(c *gin.Context) {
	taskID := c.Param("taskID")
	uuidTaskID, err := utils.IsUUID(taskID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Error: convert taskID into UUID", err.Error())
		return
	}
	var task models.Task
	if err := t.db.First(&task, "task_id= ?", uuidTaskID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Task not found", err.Error())
		return
	}

	var updatedData models.Task
	if err := c.ShouldBindJSON(&updatedData); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}

	if err := t.db.Model(&task).Updates(updatedData).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Error updating task", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Task updated successfully", task)
}

func (t *taskController) DeleteTask(c *gin.Context) {
	taskID := c.Param("taskID")
	uuidTaskID, err := utils.IsUUID(taskID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Error: convert taskID into UUID", err.Error())
		return
	}
	if err := t.db.Delete(&models.Task{}, "id = ?", uuidTaskID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Error deleting task", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Task deleted successfully", nil)
}

func (t *taskController) ChangeStatusTask(c *gin.Context) {
	taskID := c.Param("taskID")
	uuidTaskID, err := utils.IsUUID(taskID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Error: convert taskID into UUID", err.Error())
		return
	}

	var statusUpdate struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&statusUpdate); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}

	validStatuses := map[string]bool{
		"pending":     true,
		"in_progress": true,
		"completed":   true,
	}
	if !validStatuses[statusUpdate.Status] {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid status value", "Allowed values: pending, in_progress, completed")
		return
	}

	var task models.Task
	if err := t.db.Where("id = ?", uuidTaskID).First(&task).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Task not found", err.Error())
		return
	}

	task.Status = statusUpdate.Status
	if err := t.db.Save(&task).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to update task status", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Task status updated successfully", task)
}
