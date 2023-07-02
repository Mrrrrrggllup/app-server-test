package tests

import (
	"fmt"
	"homeAssignement/rest-api-server-test/mocks"
	"homeAssignement/rest-api-server-test/models"
	"homeAssignement/rest-api-server-test/services"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestCreateServer(t *testing.T) {
	// Create a mock for the repository
	repoMock := &mocks.MockServerRepository{}

	// Create an instance of the service using the mock repository
	service := services.NewServerService(repoMock)

	// Define the expected behavior of the repository mock
	repoMock.On("FindByName", "New server").Return(nil, fmt.Errorf("record not found"))
	repoMock.On("Create", mock.AnythingOfType("*models.Server")).Return(nil)

	// Call the method we are testing
	input := models.CreateServerInput{Name: "New server", Type: "small", Status: "stopped"}
	server, err := service.CreateServer(input)

	// Verify the results
	assert.Nil(t, err)
	assert.NotNil(t, server)
	assert.Equal(t, "New server", server.Name)
	assert.Equal(t, models.Small, server.Type)
	assert.Equal(t, models.Stopped, server.Status)

	// Verify that the expectations were met
	repoMock.AssertCalled(t, "FindByName", "New server")
	repoMock.AssertCalled(t, "Create", mock.AnythingOfType("*models.Server"))
}

func TestCreateServer_ExistingName(t *testing.T) {

	// Create a mock for the repository
	repoMock := &mocks.MockServerRepository{}

	// Create an instance of the service using the mock repository
	service := services.NewServerService(repoMock)

	existingServer := &models.Server{ID: 1, Name: "Test", Type: "small", Status: "stopped"}

	// Define the expected behavior of the repository mock
	repoMock.On("FindByName", "Test").Return(existingServer, nil)

	// Call the method we are testing
	input := models.CreateServerInput{Name: "Test", Type: "small", Status: "stopped"}
	server, err := service.CreateServer(input)

	// Verify the results
	assert.NotNil(t, err)
	assert.Nil(t, server)

	// Verify that the expectations were met
	repoMock.AssertCalled(t, "FindByName", "Test")
	repoMock.AssertNotCalled(t, "Create", mock.AnythingOfType("*models.Server"))
}

func TestUpdateServer(t *testing.T) {
	// Create a mock for the repository
	repoMock := &mocks.MockServerRepository{}

	// Create an instance of the service using the mock repository
	service := services.NewServerService(repoMock)

	// Define the input and expected server
	input := models.UpdateServerInput{
		Name:   "Updated server",
		Type:   "large",
		Status: "running",
	}
	expectedServer := &models.Server{
		ID:     1,
		Name:   "Updated server",
		Type:   "large",
		Status: "running",
	}

	// Define the existing server and its updated name
	existingServer := &models.Server{
		ID:     1,
		Name:   "Original server",
		Type:   "small",
		Status: "stopped",
	}

	repoMock.On("FindByID", expectedServer.ID).Return(existingServer, nil)
	repoMock.On("FindByName", input.Name).Return(nil, fmt.Errorf("record not found"))
	repoMock.On("Update", expectedServer).Return(nil)

	server, err := service.UpdateServer(expectedServer.ID, input)

	// Verify the results
	assert.Nil(t, err)
	assert.NotNil(t, server)
	assert.Equal(t, expectedServer, server)

	// Verify that the expectations were met
	repoMock.AssertCalled(t, "FindByID", expectedServer.ID)
	repoMock.AssertCalled(t, "FindByName", input.Name)
	repoMock.AssertCalled(t, "Update", expectedServer)
}

func TestUpdateServer_ExistingName(t *testing.T) {

	// Create a mock for the repository
	repoMock := &mocks.MockServerRepository{}

	// Create an instance of the service using the mock repository
	service := services.NewServerService(repoMock)

	// Define the input and expected server
	input := models.UpdateServerInput{
		Name:   "Updated server",
		Type:   "large",
		Status: "running",
	}
	expectedServer := &models.Server{
		ID:     1,
		Name:   "Updated server",
		Type:   "large",
		Status: "running",
	}

	// Define the existing server and its updated name
	existingServer := &models.Server{
		ID:     1,
		Name:   "Original server",
		Type:   "small",
		Status: "stopped",
	}

	repoMock.On("FindByID", expectedServer.ID).Return(existingServer, nil)
	repoMock.On("FindByName", input.Name).Return(existingServer, nil)

	server, err := service.UpdateServer(expectedServer.ID, input)

	// Verify the results
	assert.NotNil(t, err)
	assert.Nil(t, server)

	// Verify that the expectations were met
	repoMock.AssertCalled(t, "FindByID", expectedServer.ID)
	repoMock.AssertCalled(t, "FindByName", input.Name)
	repoMock.AssertNotCalled(t, "Update", expectedServer)
}

func TestUpdateServer_WrongId(t *testing.T) {

	// Create a mock for the repository
	repoMock := &mocks.MockServerRepository{}

	// Create an instance of the service using the mock repository
	service := services.NewServerService(repoMock)

	// Define the input and expected server
	input := models.UpdateServerInput{
		Name:   "Updated server",
		Type:   "large",
		Status: "running",
	}
	expectedServer := &models.Server{
		ID:     1,
		Name:   "Updated server",
		Type:   "large",
		Status: "running",
	}

	repoMock.On("FindByID", expectedServer.ID).Return(nil, fmt.Errorf("record not found"))

	server, err := service.UpdateServer(expectedServer.ID, input)

	// Verify the results
	assert.NotNil(t, err)
	assert.Nil(t, server)

	// Verify that the expectations were met
	repoMock.AssertCalled(t, "FindByID", expectedServer.ID)
	repoMock.AssertNotCalled(t, "FindByName", input.Name)
	repoMock.AssertNotCalled(t, "Update", expectedServer)
}

func TestGetAllServers(t *testing.T) {
	// Create a mock for the repository
	repoMock := &mocks.MockServerRepository{}

	// Create an instance of the service using the mock repository
	service := services.NewServerService(repoMock)

	// Define the expected list of servers
	expectedServers := []models.Server{
		{ID: 1, Name: "Server 1", Type: "small", Status: "running"},
		{ID: 2, Name: "Server 2", Type: "large", Status: "stopped"},
	}

	// Define the behavior of the repository mock
	repoMock.On("FindAll").Return(expectedServers, nil)

	// Call the method we are testing
	servers, err := service.GetAllServers()

	// Verify the results
	assert.Nil(t, err)
	assert.NotNil(t, servers)
	assert.Equal(t, expectedServers, servers)

	// Verify that the expectation was met
	repoMock.AssertCalled(t, "FindAll")
}

func TestUpdateServerStatus(t *testing.T) {
	// Create a mock for the repository
	repoMock := &mocks.MockServerRepository{}

	// Create an instance of the service using the mock repository
	service := services.NewServerService(repoMock)

	// Define the input for updating server status
	input := models.UpdateServerStatusInput{
		Ids:    []int64{1, 2, 3},
		Status: "running",
	}

	// Define the list of servers to be updated
	servers := []models.Server{
		{ID: 1, Name: "Server 1", Type: "small", Status: "stopped"},
		{ID: 2, Name: "Server 2", Type: "large", Status: "stopped"},
		{ID: 3, Name: "Server 3", Type: "medium", Status: "stopped"},
	}

	// Define the behavior of the repository mock
	repoMock.On("FindByIDs", input.Ids).Return(servers, nil)
	repoMock.On("UpdateAll", mock.AnythingOfType("*[]models.Server")).Return(nil)

	// Call the method we are testing
	updatedServers, err := service.UpdateServerStatus(input)

	// Verify the results
	assert.Nil(t, err)
	assert.NotNil(t, updatedServers)
	assert.Equal(t, input.Status, updatedServers[0].Status)
	assert.Equal(t, input.Status, updatedServers[1].Status)
	assert.Equal(t, input.Status, updatedServers[2].Status)

	// Verify that the expectations were met
	repoMock.AssertCalled(t, "FindByIDs", input.Ids)
	repoMock.AssertCalled(t, "UpdateAll", mock.AnythingOfType("*[]models.Server"))
}

func TestUpdateServerStatus_WrongId(t *testing.T) {
	// Create a mock for the repository
	repoMock := &mocks.MockServerRepository{}

	// Create an instance of the service using the mock repository
	service := services.NewServerService(repoMock)

	// Define the input for updating server status
	input := models.UpdateServerStatusInput{
		Ids:    []int64{1, 2, 3},
		Status: "running",
	}

	// Define the list of servers to be updated
	servers := []models.Server{
		{ID: 1, Name: "Server 1", Type: "small", Status: "stopped"},
	}

	// Define the behavior of the repository mock
	repoMock.On("FindByIDs", input.Ids).Return(servers, nil)

	// Call the method we are testing
	updatedServers, err := service.UpdateServerStatus(input)

	// Verify the results
	assert.NotNil(t, err)
	assert.Nil(t, updatedServers)

	// Verify that the expectations were met
	repoMock.AssertCalled(t, "FindByIDs", input.Ids)
	repoMock.AssertNotCalled(t, "UpdateAll", mock.AnythingOfType("*[]models.Server"))
}

func TestDeleteServer(t *testing.T) {
	// Create a mock for the repository
	repoMock := &mocks.MockServerRepository{}

	// Create an instance of the service using the mock repository
	service := services.NewServerService(repoMock)

	// Define the ID of the server to be deleted
	serverID := int64(1)

	// Define the server to be returned by the FindByID method
	server := &models.Server{
		ID:     serverID,
		Name:   "Test Server",
		Type:   "small",
		Status: "running",
	}

	// Define the behavior of the repository mock
	repoMock.On("FindByID", serverID).Return(server, nil)
	repoMock.On("Delete", server).Return(nil)

	// Call the method we are testing
	err := service.DeleteServer(serverID)

	// Verify the result
	assert.Nil(t, err)

	// Verify that the expectations were met
	repoMock.AssertCalled(t, "FindByID", serverID)
	repoMock.AssertCalled(t, "Delete", server)
}

func TestDeleteServer_WrongId(t *testing.T) {
	// Create a mock for the repository
	repoMock := &mocks.MockServerRepository{}

	// Create an instance of the service using the mock repository
	service := services.NewServerService(repoMock)

	// Define the ID of the server to be deleted
	serverID := int64(1)

	// Define the server to be returned by the FindByID method
	server := &models.Server{
		ID:     serverID,
		Name:   "Test Server",
		Type:   "small",
		Status: "running",
	}

	// Define the behavior of the repository mock
	repoMock.On("FindByID", serverID).Return(nil, fmt.Errorf("record not found"))

	// Call the method we are testing
	err := service.DeleteServer(serverID)

	// Verify the result
	assert.NotNil(t, err)

	// Verify that the expectations were met
	repoMock.AssertCalled(t, "FindByID", serverID)
	repoMock.AssertNotCalled(t, "Delete", server)
}
