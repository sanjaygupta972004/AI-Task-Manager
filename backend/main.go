package main

import (
	"ai-task-manager/config"
	"ai-task-manager/database"
	"ai-task-manager/middlewares"
	"ai-task-manager/routers"
	"ai-task-manager/websocket"
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("Starting application...")
	if err := config.LoadConfig(); err != nil {
		log.Println("Error loading config:", err)
		log.Fatal("Critical Error: Shutting down application due to config failure.")
		return
	}

	configApp := config.GetConfig()

	dbCon := &database.DBConfig{
		DbUser:     configApp.DBUser,
		DbHost:     configApp.DBHost,
		DbPort:     configApp.DBPort,
		DbPassword: configApp.DBPassword,
		DbName:     configApp.DBName,
		SSLMode:    configApp.SSLMode,
	}

	if err := database.ConnectDB(dbCon); err != nil {
		log.Fatal("Critical Error: Shutting down application due to database connection failure.")
		os.Exit(1)

	}

	// Ensure DB connection is valid
	if database.DB == nil {
		log.Fatal("Critical Error: Database connection is nil.")
		os.Exit(1)
	}

	dbInstance := database.DB
	if err := database.MigrateModels(dbInstance); err != nil {
		log.Fatal("Critical Error: Shutting down application due to database migration failure.")
		os.Exit(1)
	}
	// Initialize the database connection
	defer database.DisConnectDB()

	router := gin.New()

	router.Use(gin.Logger())
	router.Use(middlewares.CorsMiddleWare())
	router.Use(middlewares.RecoverMiddleware())
	router.Use(gin.ErrorLogger())

	// setupRoutes
	routers.SetupRouter(router, dbInstance)
	routers.SetupHealthCheckRouter(router)

	// Start the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port if not specified
	}
	log.Println("Server started on port:", port)
	log.Println("Application started successfully.")
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welcome to the AI Task Manager API",
			"status":  "ok",
			"code":    200,
			"error":   nil,
			"data":    nil,
		})
	})

	// Set up the WebSocket route
	go func() {
		for {
			msg := <-websocket.Manager.Broadcast
			websocket.Manager.BroadcastMessage(msg)
		}
	}()
	// Start the server
	router.Run(fmt.Sprintf(":%s", port))

}
