package database

import (
	"ai-task-manager/models"
	"errors"

	"gorm.io/gorm"
)

func MigrateModels(db *gorm.DB) error {
	if db == nil {
		return errors.New("db instance is nil; ensure it is properly initialized")
	}

	if err := db.Migrator().DropTable(&models.Task{}, &models.User{}); err != nil {
		panic("Failed to drop tables: " + err.Error())
	}

	if err := db.AutoMigrate(&models.User{}); err != nil {
		panic("Failed to migrate User table: " + err.Error())
	}

	if err := db.AutoMigrate(&models.Task{}); err != nil {
		panic("Failed to migrate Task table: " + err.Error())
	}

	println("Database migration completed successfully")
	return nil
}
