package websocket

import (
	"fmt"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"net/http"
)

type WebSocketManager struct {
	clients   map[*websocket.Conn]bool
	Broadcast chan []byte
	mu        sync.Mutex
}

var Manager = &WebSocketManager{
	clients:   make(map[*websocket.Conn]bool),
	Broadcast: make(chan []byte),
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (manager *WebSocketManager) HandleConnections(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		fmt.Println("WebSocket Upgrade Error:", err)
		return
	}
	manager.mu.Lock()
	manager.clients[conn] = true
	manager.mu.Unlock()

	defer func() {
		manager.mu.Lock()
		delete(manager.clients, conn)
		manager.mu.Unlock()
		conn.Close()
	}()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			break
		}
		manager.Broadcast <- msg
	}
}

func (manager *WebSocketManager) BroadcastMessage(message []byte) {
	manager.mu.Lock()
	defer manager.mu.Unlock()

	for client := range manager.clients {
		err := client.WriteMessage(websocket.TextMessage, message)
		if err != nil {
			client.Close()
			delete(manager.clients, client)
		}
	}
}
