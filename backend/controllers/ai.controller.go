package controllers

import (
	"ai-task-manager/config"
	"ai-task-manager/models"
	"ai-task-manager/utils"
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	openai "github.com/sashabaranov/go-openai"
	"gorm.io/gorm"
)

type AiSuggestionController interface {
	GetTaskSuggestions(c *gin.Context)
}

type aiSuggestionController struct {
	db *gorm.DB
}

func NewAiSuggestionController(db *gorm.DB) AiSuggestionController {
	return &aiSuggestionController{
		db: db,
	}
}

func (ats *aiSuggestionController) GetTaskSuggestions(c *gin.Context) {
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

	var tasks []models.Task

	if err := ats.db.Where("user_id = ?", uuidUserID).Find(&tasks).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Error fetching tasks", err.Error())
		return
	}

	// Create OpenAI client
	openAPIKey := config.GetConfig().OpenAIAPIKey
	client := openai.NewClient(openAPIKey)

	prompt := "I need suggestions for new tasks based on my current task list:\n"
	for _, task := range tasks {
		prompt += "- " + task.Title + ": " + task.Description + " (Status: " + task.Status + ")\n"
	}
	prompt += "\nPlease suggest 3 new relevant tasks based on this list."

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT3Dot5Turbo,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get AI suggestions"})
		return
	}

	suggestions := resp.Choices[0].Message.Content

	utils.SuccessResponse(c, http.StatusOK, "AI Suggestions", suggestions)
}
