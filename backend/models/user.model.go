package models

import (
	"ai-task-manager/utils"
	"ai-task-manager/validations"
	"fmt"
	"strings"
	"time"

	"github.com/gofrs/uuid"
	"gorm.io/gorm"
)

type User struct {
	UserID    uuid.UUID      `gorm:"type:uuid;primaryKey;unique;not null" json:"userID"`
	Email     string         `gorm:"unique;not null" json:"email"`
	Username  string         `gorm:"unique;not null" json:"username"`
	Password  string         `gorm:"not null" json:"password"`
	CreatedAt time.Time      `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime" json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deletedAt"`

	// Relationship
	//Tasks []Task `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL" json:"tasks"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	id := uuid.Must(uuid.NewV4())
	if id != uuid.Nil {
		u.UserID = id
	}

	if err := validations.ValidateUser(validations.User{
		UserID:   u.UserID,
		Email:    u.Email,
		Username: u.Username,
		Password: u.Password,
	}); err != nil {
		return err
	}

	return nil
}

func (u *User) BeforeSave(tx *gorm.DB) error {
	if u.Password != "" && !strings.HasPrefix(u.Password, "$2a$") {
		fmt.Println("Hashing password:", u.Password)
		hashedPassword, err := utils.HashPassword(u.Password)
		if err != nil {
			return err
		}
		u.Password = hashedPassword
	} else {
		fmt.Println("Password already hashed or empty, not hashing again")
	}
	return nil
}

func (User) TableName() string {
	return "Users"
}
