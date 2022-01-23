package controllers

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"../models"
)

func FindClasses(c *gin.Context) {
  var classes []models.Class
  models.DB.Find(&classes)

  c.JSON(http.StatusOK, gin.H{"data": classes})
}