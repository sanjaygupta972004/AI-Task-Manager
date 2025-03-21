package routers

import (
	"ai-task-manager/websocket"
	"github.com/gin-gonic/gin"
)

func SetWebSocketRoutes(r *gin.Engine) {
	r.GET("/ws", websocket.Manager.HandleConnections)
}
