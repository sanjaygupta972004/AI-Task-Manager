package routers

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type HealthCheckResponse struct {
	Message string `json:"message" example:"Server is running and healthy"`
	Status  string `json:"status" example:"healthy"`
	Code    int    `json:"code" example:"200"`
	Error   any    `json:"error"`
	Data    any    `json:"data"`
}

func SetupHealthCheckRouter(router *gin.Engine) {
	router.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"message": "Server is running and healthy",
			"status":  "healthy",
			"code":    200,
			"error":   nil,
			"data":    nil,
		})
	})
}

func SetupRouter(router *gin.Engine, db *gorm.DB) {
	rg := router.Group("/api/v1")
	{
		SetupTaskRouter(rg, db)
		SetupUserRouter(rg, db)
		SetWebSocketRoutes(router)
	}

}
