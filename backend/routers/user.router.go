package routers

import (
	"ai-task-manager/controllers"
	"ai-task-manager/middlewares"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupUserRouter(rg *gin.RouterGroup, db *gorm.DB) {

	userHandler := controllers.NewUserController(db)
	authMiddleware := middlewares.JWTVerifyForUser(db)
	router := rg.Group("/users")

	{
		router.GET("/", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "Hello from user router",
			})
		},
		)

		router.POST("/signup", userHandler.SignUp)
		router.POST("/signin", userHandler.SignIn)
		router.GET("/signout", authMiddleware, userHandler.SignOut)
		router.GET("/get-user-profile", authMiddleware, userHandler.GetUserProfile)
		router.PATCH("/update-user-profile/c/:userID", authMiddleware, userHandler.UpdateUserProfile)
		router.DELETE("/delete-user-profile", authMiddleware, userHandler.DeleteUser)
		router.GET("/get-all-users", authMiddleware, userHandler.GetAllUsers)

	}

}
