package routers

import (
	"ai-task-manager/controllers"
	"ai-task-manager/middlewares"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupTaskRouter(rg *gin.RouterGroup, db *gorm.DB) {

	taskHandler := controllers.NewTaskController(db)
	authMiddleware := middlewares.JWTVerifyForUser(db)
	router := rg.Group("/tasks")
	router.Use(authMiddleware)

	{
		router.GET("/", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "Hello from task router",
			})
		},
		)

		router.POST("/add-new-task", taskHandler.CreateTask)
		router.GET("/get-task/:taskID", taskHandler.GetTask)
		router.GET("/get-all-task", taskHandler.GetAllTasks)
		router.PUT("/update-task/:taskID", taskHandler.UpdateTask)
		router.DELETE("/delete-task/:taskID", taskHandler.DeleteTask)
	}

}
