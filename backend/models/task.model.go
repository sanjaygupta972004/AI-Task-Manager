package models

import (
	"ai-task-manager/validations"
	"time"

	"github.com/gofrs/uuid"
	"gorm.io/gorm"
)

type Task struct {
	TaskID      uuid.UUID      `gorm:"type:uuid;primaryKey;unique;not null;index" json:"taskID"`
	Title       string         `gorm:"not null" json:"title"`
	Description string         `gorm:"not null" json:"description"`
	Status      string         `gorm:"type:task_status;default:'pending'" json:"status"`
	AssignedTo  uuid.UUID      `gorm:"" json:"assignedTo"`
	CreatedAt   time.Time      `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt   time.Time      `gorm:"autoUpdateTime" json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deletedAt"`
	UserID      uuid.UUID      `gorm:"type:uuid;not null" json:"userID"`
	// Foreign key
	//User User `gorm:"foreignKey:UserID;references:UserID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"user"`
}

func (t *Task) BeforeCreate(tx *gorm.DB) error {
	id := uuid.Must(uuid.NewV4())
	if id != uuid.Nil {
		t.TaskID = id
	}
	if err := validations.ValidateTask(validations.Task{
		Title:       t.Title,
		Description: t.Description,
		Status:      t.Status,
	}); err != nil {
		return err
	}
	return nil
}

func (t *Task) BeforeUpdate(tx *gorm.DB) error {
	if err := validations.ValidateTask(validations.Task{
		Title:       t.Title,
		Description: t.Description,
		Status:      t.Status,
	}); err != nil {
		return err
	}
	return nil
}

func (Task) TableName() string {
	return "Tasks"
}
