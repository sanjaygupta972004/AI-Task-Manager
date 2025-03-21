package controllers

import (
	"ai-task-manager/config"
	"ai-task-manager/models"
	"ai-task-manager/utils"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"gorm.io/gorm"
)

func signJWTForUser(user *models.User) (string, error) {
	secretKey := config.GetConfig().JWTSecret
	secretExpiryTime := config.GetConfig().JWTExpiryTime

	if secretKey == "" || secretExpiryTime == 0 {
		return "", fmt.Errorf("JWT_SECRET_KEY environment variable not set")
	}
	claims := jwt.MapClaims{
		"id":    user.UserID,
		"email": user.Email,
		"iss":   "oauth-app-golang",
		"exp":   secretExpiryTime,
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

type UserController interface {
	SignUp(c *gin.Context)
	SignIn(c *gin.Context)
	SignOut(c *gin.Context)
	GetUserProfile(c *gin.Context)
	UpdateUserProfile(c *gin.Context)
	DeleteUser(c *gin.Context)
	GetAllUsers(c *gin.Context)
}

type userController struct {
	db *gorm.DB
}

func NewUserController(db *gorm.DB) UserController {
	return &userController{
		db: db,
	}
}

func (u *userController) SignUp(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}
	if err := u.db.Model(&models.User{}).Where("email = ?", user.Email).First(&user).Error; err == nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "User already exists", "")
		return
	}
	if err := u.db.Create(&user).Error; err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Error creating user", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "User created successfully", user)
}

func (u *userController) SignIn(c *gin.Context) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&credentials); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}

	var user models.User
	if err := u.db.Where("email = ?", credentials.Email).First(&user).Error; err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid email or password", "")
		return
	}

	err := utils.CompareHashAndPassword(user.Password, credentials.Password)
	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid email or password", "")
		return
	}

	token, err := signJWTForUser(&user)

	if err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Error while Generating error", err.Error())
		return
	}

	if token != "" {
		c.SetCookie("access_token", token, 60*60*24*1, "/", "", false, true)
	}

	utils.SuccessResponse(c, http.StatusOK, "Sign-in successful", gin.H{"accessToken": token})
}

func (u *userController) SignOut(c *gin.Context) {
	c.SetCookie("access_token", "", 60*60*24*1, "/", "", false, true)
	utils.SuccessResponse(c, http.StatusOK, "Sign-out successful", nil)
}

func (u *userController) GetUserProfile(c *gin.Context) {
	userID := c.Param("userID")
	uuidUserID, err := utils.IsUUID(userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Error: convert userID into UUID", err.Error())
		return
	}
	var user models.User
	if err := u.db.First(&user, "user_id = ?", uuidUserID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "User not found", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "User profile retrieved successfully", user)
}

func (u *userController) UpdateUserProfile(c *gin.Context) {
	userID := c.Param("userID")
	uuidUserID, err := utils.IsUUID(userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Error: convert userID into UUID", err.Error())
		return
	}
	var user models.User
	if err := u.db.First(&user, "user_id = ?", uuidUserID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "User not found", err.Error())
		return
	}

	var updatedData models.User
	if err := c.ShouldBindJSON(&updatedData); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}

	if err := u.db.Model(&user).Updates(updatedData).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Error updating user", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "User profile updated successfully", user)
}

func (u *userController) DeleteUser(c *gin.Context) {
	userID := c.Param("userID")
	uuidUserID, err := utils.IsUUID(userID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Error: convert userID into UUID", err.Error())
		return
	}
	if err := u.db.Delete(&models.User{}, "user_id = ?", uuidUserID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Error deleting user", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "User deleted successfully", nil)
}

func (u *userController) GetAllUsers(c *gin.Context) {
	var users []models.User
	if err := u.db.Find(&users).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Error retrieving users", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Users retrieved successfully", users)
}
