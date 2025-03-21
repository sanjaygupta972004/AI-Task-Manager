package routers

import (
	"ai-task-manager/controllers"
	"ai-task-manager/middlewares"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupAiSuggestionRouter(rg *gin.RouterGroup, db *gorm.DB) {

	userHandler := controllers.NewAiSuggestionController(db)
	authMiddleware := middlewares.JWTVerifyForUser(db)
	router := rg.Group("/users")
	router.Use(authMiddleware)

	{
		router.GET("/", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "Hello from user router",
			})
		},
		)

		router.GET("/get-task-suggestions", userHandler.GetTaskSuggestions)
	}

}
