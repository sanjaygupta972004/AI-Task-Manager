package validations

import (
	"errors"
)

type Task struct {
	Title       string
	Description string
	Status      string
}

func validateTaskStatus(status string) error {
	validStatuses := map[string]bool{
		"pending":     true,
		"in_progress": true,
		"completed":   true,
	}
	if !validStatuses[status] {
		return errors.New("invalid status: must be 'pending', 'in_progress', or 'completed'")
	}
	return nil
}

func ValidateTask(task Task) error {
	if task.Title == "" {
		return errors.New("title must not be empty")
	}
	if len(task.Title) < 3 {
		return errors.New("title must be at least 3 characters long")
	}
	if task.Description == "" {
		return errors.New("description must not be empty")
	}
	if err := validateTaskStatus(task.Status); err != nil {
		return err
	}
	return nil
}
