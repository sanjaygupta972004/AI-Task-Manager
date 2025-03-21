package config

import (
	"fmt"
	"log"
	"os"
	"sync"
	"time"

	"github.com/joho/godotenv"
)

var (
	config     Config
	configOnce sync.Once
	isLoaded   bool
	mu         sync.RWMutex
)

type Config struct {
	DBHost        string
	DBPort        string
	DBUser        string
	DBPassword    string
	DBName        string
	SSLMode       string
	JWTSecret     string
	JWTExpiryTime time.Duration
	OpenAIAPIKey  string
}

func LoadEnvFile() error {
	envPath := ".env"
	fmt.Println("Loading environment file: ", envPath)
	return godotenv.Load(envPath)
}

func LoadConfig() error {
	var loadErr error
	configOnce.Do(func() {
		if err := LoadEnvFile(); err != nil {
			loadErr = fmt.Errorf("failed to load environment file: %w", err)
			return
		}

		mu.Lock()
		defer mu.Unlock()

		expiryTime, err := time.ParseDuration(os.Getenv("JWT_EXPIRY_TIME"))
		if err != nil {
			loadErr = fmt.Errorf("invalid JWT_EXPIRY_TIME format: %w", err)
			return
		}

		config = Config{
			DBHost:        os.Getenv("DB_HOST"),
			DBPort:        os.Getenv("DB_PORT"),
			DBUser:        os.Getenv("DB_USER"),
			DBPassword:    os.Getenv("DB_PASSWORD"),
			DBName:        os.Getenv("DB_NAME"),
			JWTSecret:     os.Getenv("JWT_SECRET"),
			SSLMode:       os.Getenv("DB_SSLMODE"),
			JWTExpiryTime: expiryTime,
			OpenAIAPIKey:  os.Getenv("OPENAI_API_KEY"),
		}

		// Validate required fields
		requiredFields := map[string]string{
			"DB_HOST":        config.DBHost,
			"DB_PORT":        config.DBPort,
			"DB_USER":        config.DBUser,
			"DB_PASSWORD":    config.DBPassword,
			"DB_NAME":        config.DBName,
			"JWT_SECRET":     config.JWTSecret,
			"OPENAI_API_KEY": config.OpenAIAPIKey,
		}

		for key, value := range requiredFields {
			if value == "" {
				loadErr = fmt.Errorf("missing required environment variable: %s", key)
				return
			}
		}

		isLoaded = true
	})

	fmt.Println("Config loaded successfully")
	return loadErr
}

func GetConfig() *Config {
	mu.RLock()
	defer mu.RUnlock()

	if !isLoaded {
		log.Fatal("Config is not initialized. Call LoadConfig() first.")
	}
	return &config
}
