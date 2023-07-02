package controllers

import (
	"fmt"
	"homeAssignement/rest-api-server-test/models"
	service "homeAssignement/rest-api-server-test/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ServerController struct {
	serverService service.ServerService
}

func NewServerController(serverService service.ServerService) *ServerController {
	return &ServerController{
		serverService: serverService,
	}
}

// GET /servers
// Get all servers
func (c *ServerController) FindServers(ctx *gin.Context) {
	servers, err := c.serverService.GetAllServers()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch servers"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": servers})
}

func (ctrl *ServerController) CreateServer(ctx *gin.Context) {
	var input models.CreateServerInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	server, err := ctrl.serverService.CreateServer(input)
	if err != nil {
		ctx.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": server})
}

// GET /server/:id
// Find a server by id
func (c *ServerController) FindServerByID(ctx *gin.Context) {
	serverID, err := getServerIDFromContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}

	server, err := c.serverService.FindServerByID(serverID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Record not found!"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": server})
}

// PUT /servers/status
// Update servers status
func (c *ServerController) UpdateServerStatus(ctx *gin.Context) {
	var input models.UpdateServerStatusInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	servers, err := c.serverService.UpdateServerStatus(input)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": servers})
}

// PUT /server/:id
// Update a server
func (c *ServerController) UpdateServer(ctx *gin.Context) {
	serverID, err := getServerIDFromContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}

	var input models.UpdateServerInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	server, err := c.serverService.UpdateServer(serverID, input)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": server})
}

// DELETE /server/:id
// Delete a server
func (c *ServerController) DeleteServer(ctx *gin.Context) {
	serverID := ctx.Param("id")
	id, err := strconv.ParseInt(serverID, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid server ID"})
		return
	}

	err = c.serverService.DeleteServer(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete server"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": true})
}

// DELETE /servers
// Delete a server
func (c *ServerController) DeleteServers(ctx *gin.Context) {
	var input []int64
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := c.serverService.DeleteServers(input)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete servers"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": input})
}

/*
func convertServerIDs(input []int64) ([]int64, error) {
	var ids []int64
	for _, idStr := range input {
		id, err := strconv.ParseInt(idStr, 10, 64)
		if err != nil {
			return nil, fmt.Errorf("invalid server ID: %s", idStr)
		}
		ids = append(ids, id)
	}
	return ids, nil
} */

func getServerIDFromContext(ctx *gin.Context) (int64, error) {
	serverID := ctx.Param("id")
	id, err := strconv.ParseInt(serverID, 10, 64)
	if err != nil {
		return 0, fmt.Errorf("invalid server ID: %s", serverID)
	}
	return id, nil
}
