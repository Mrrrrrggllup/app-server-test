package controllers

import (
	"fmt"
	"homeAssignement/rest-api-server-test/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreateServerInput struct {
	Name string `json:"name" binding:"required"`
	Type string `json:"type" binding:"required,validServerTypeValue"`
}

type UpdateServerInput struct {
	Name   string `json:"name"`
	Type   string `json:"type" binding:"validServerTypeValue"`
	Status string `json:"status" binding:"validServerStatusValue"`
}

type UpdateServerStatusInput struct {
	Ids    []int64             `json:"ids" binding:"required,min=1"`
	Status models.ServerStatus `json:"status" binding:"required,validServerStatusValue"`
}

// GET /servers
// Get all servers
func FindServers(c *gin.Context) {
	var servers []models.Server
	models.DB.Find(&servers)

	c.JSON(http.StatusOK, gin.H{"data": servers})
}

// POST /servers
// Create new server
func CreateServer(c *gin.Context) {
	// Validate input
	var input CreateServerInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if the server name already exists
	var existingServer models.Server
	models.DB.Where("name = ?", input.Name).First(&existingServer)

	if existingServer.ID != 0 {
		c.JSON(http.StatusConflict, gin.H{"error": fmt.Sprintf("Server name %s already exists", input.Name)})
		return
	}

	// Create server
	server := models.Server{Name: input.Name, Type: models.ServerType(input.Type), Status: models.Stopped}

	models.DB.Create(&server)

	c.JSON(http.StatusOK, gin.H{"data": server})
}

// GET /server/:id
// Find a server by id
func FindServer(c *gin.Context) {
	// Get model if exist
	var server models.Server

	if err := models.DB.Where("id = ?", c.Param("id")).First(&server).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": server})
}

// PUT /servers/status
// Update servers status
func UpdateServerStatus(c *gin.Context) {

	var input UpdateServerStatusInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var servers []models.Server

	if err := models.DB.Where(input.Ids).Find(&servers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := validateServerIDs(input.Ids, servers); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	for i := range servers {
		servers[i].Status = models.ServerStatus(input.Status)
	}

	if err := models.DB.Save(&servers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update servers"})
		return
	}

	c.JSON(http.StatusOK, servers)
}

// PATCH /server/:id
// Update a server
func UpdateServer(c *gin.Context) {

	// Validate input
	var input UpdateServerInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get model if exist
	var server models.Server

	if err := models.DB.Where("id = ?", c.Param("id")).First(&server).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	fmt.Println(input)
	fmt.Println(server)

	// Check if the server name already exists
	if input.Name != "" && input.Name != server.Name {
		var existingServer models.Server
		if err := models.DB.Where("name = ?", input.Name).First(&existingServer).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if existingServer.ID != 0 {
			c.JSON(http.StatusConflict, gin.H{"error": fmt.Sprintf("Server name %s already exists", input.Name)})
			return
		}
	}

	models.DB.Model(&server).Updates(input)

	c.JSON(http.StatusOK, gin.H{"data": server})
}

// DELETE /server/:id
// Delete a server
func DeleteServer(c *gin.Context) {
	// Get model if exist
	var server models.Server
	if err := models.DB.Where("id = ?", c.Param("id")).First(&server).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	models.DB.Delete(&server)

	c.JSON(http.StatusOK, gin.H{"data": true})
}

// DELETE /servers
// Delete a server
func DeleteServers(c *gin.Context) {
	// Get model if exist
	var input []int64
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var servers []models.Server

	if err := models.DB.Where(input).Find(&servers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := validateServerIDs(input, servers); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Delete(&servers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete servers"})
		return
	}

	c.JSON(http.StatusOK, servers)
}

func validateServerIDs(ids []int64, servers []models.Server) error {
	idSet := make(map[int64]bool)

	for _, serv := range servers {
		idSet[serv.ID] = true
	}

	fmt.Println(idSet)

	missingIDs := make([]int64, 0)

	for _, id := range ids {
		if !idSet[id] {
			missingIDs = append(missingIDs, id)
		}
	}

	if len(missingIDs) > 0 {
		return fmt.Errorf("IDs not found in server list: %v", missingIDs)
	}

	fmt.Println(missingIDs)

	return nil
}
