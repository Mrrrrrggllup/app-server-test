package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"homeAssignement/rest-api-server-test/controllers"
	"homeAssignement/rest-api-server-test/models"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

var serverIDs []int64

func InsertTestServers() {

	server1 := models.Server{Name: "Server 1", Status: models.Running}
	server2 := models.Server{Name: "Server 2", Status: models.Starting}
	server3 := models.Server{Name: "Server 3", Status: models.Stopped}

	models.DB.Create(&server1)
	models.DB.Create(&server2)
	models.DB.Create(&server3)

	serverIDs = append(serverIDs, server1.ID, server2.ID, server3.ID)
}

func DeleteTestServers() error {

	if len(serverIDs) == 0 {
		return nil
	}

	if err := models.DB.Where("id IN ?", serverIDs).Delete(&models.Server{}).Error; err != nil {
		return err
	}

	// Réinitialiser le tableau d'IDs
	serverIDs = nil

	return nil
}

func TestCreateServer(t *testing.T) {

	setupRouter()
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	serverName := "Test Server" + fmt.Sprint(time.Now().Unix())
	requestBody := map[string]interface{}{
		"name": serverName,
		"type": "small",
	}
	requestBytes, _ := json.Marshal(requestBody)

	req, _ := http.NewRequest("POST", "/servers", bytes.NewBuffer(requestBytes))
	req.Header.Set("Content-Type", "application/json")

	c.Request = req
	controllers.CreateServer(c)

	assert.Equal(t, http.StatusOK, w.Code)

	var response struct {
		Data models.Server `json:"data"`
	}
	json.Unmarshal(w.Body.Bytes(), &response)

	assert.Equal(t, serverName, response.Data.Name)
	assert.Equal(t, models.Small, response.Data.Type)
	assert.Equal(t, models.Stopped, response.Data.Status)

	// Delete the test server
	models.DB.Where("id = ?", response.Data.ID).Delete(&models.Server{})
}

func TestCreateServer_WrongType(t *testing.T) {
	// Create a gin.Context instance to simulate the request
	setupRouter()
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// Define JSON data for the request
	requestBody := map[string]interface{}{
		"name": "Test Server",
		"type": "wrong_type",
	}
	requestBytes, _ := json.Marshal(requestBody)

	// Create a POST HTTP request with JSON data
	req, _ := http.NewRequest("POST", "/server", bytes.NewBuffer(requestBytes))
	req.Header.Set("Content-Type", "application/json")

	// Execute CreateServer method
	c.Request = req
	controllers.CreateServer(c)

	// Verify if the response status code is 400
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestCreateServer_ExistingName(t *testing.T) {

	// Create a gin.Context instance to simulate the request
	setupRouter()
	InsertTestServers()

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// Define JSON data for the request
	requestBody := map[string]interface{}{
		"name": "Server 1",
		"type": "small",
	}
	requestBytes, _ := json.Marshal(requestBody)

	// Create a POST HTTP request with JSON data
	req, _ := http.NewRequest("POST", "/server", bytes.NewBuffer(requestBytes))
	req.Header.Set("Content-Type", "application/json")

	// Execute CreateServer method
	c.Request = req
	controllers.CreateServer(c)

	// Verify if the response status code is 409
	assert.Equal(t, http.StatusConflict, w.Code)

	// Delete the test server
	DeleteTestServers()
}

func TestCreateServer_MissingName(t *testing.T) {
	// Create a gin.Context instance to simulate the request
	setupRouter()
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// Define JSON data for the request
	requestBody := map[string]interface{}{
		"type": "small",
	}
	requestBytes, _ := json.Marshal(requestBody)

	// Create a POST HTTP request with JSON data
	req, _ := http.NewRequest("POST", "/server", bytes.NewBuffer(requestBytes))
	req.Header.Set("Content-Type", "application/json")

	// Execute CreateServer method
	c.Request = req
	controllers.CreateServer(c)

	// Verify if the response status code is 400
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestCreateServer_MissingType(t *testing.T) {
	// Create a gin.Context instance to simulate the request
	setupRouter()
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// Define JSON data for the request
	requestBody := map[string]interface{}{
		"name": "Test Server",
	}
	requestBytes, _ := json.Marshal(requestBody)

	// Create a POST HTTP request with JSON data
	req, _ := http.NewRequest("POST", "/server", bytes.NewBuffer(requestBytes))
	req.Header.Set("Content-Type", "application/json")

	// Execute CreateServer method
	c.Request = req
	controllers.CreateServer(c)

	// Verify if the response status code is 400
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestCreateServer_EmptyBody(t *testing.T) {
	// Create a gin.Context instance to simulate the request
	setupRouter()
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	// Create a POST HTTP request with JSON data
	req, _ := http.NewRequest("POST", "/server", nil)
	req.Header.Set("Content-Type", "application/json")

	// Execute CreateServer method
	c.Request = req
	controllers.CreateServer(c)

	// Verify if the response status code is 400
	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestUpdateServer(t *testing.T) {

	router := setupRouter()

	InsertTestServers()

	updateData := controllers.UpdateServerInput{Name: "Updated Server", Status: "stopped"}
	jsonData, _ := json.Marshal(updateData)
	req, err := http.NewRequest("PATCH", fmt.Sprintf("/server/%d", serverIDs[0]), bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatal(err)
	}

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code, "Status code should be OK")

	var updatedServer models.Server
	if err := models.DB.Where("id = ?", serverIDs[0]).First(&updatedServer).Error; err != nil {
		t.Fatalf("Failed to retrieve updated server from the database: %v", err)
	}

	assert.Equal(t, updateData.Name, updatedServer.Name, "Server name should be updated")
	assert.Equal(t, models.ServerStatus(updateData.Status), updatedServer.Status, "Server status should be updated")
	DeleteTestServers()
}

func TestUpdateServer_ExistingName(t *testing.T) {

	router := setupRouter()

	InsertTestServers()

	updateData := controllers.UpdateServerInput{Name: "Server 2", Status: "stopped"}
	jsonData, _ := json.Marshal(updateData)
	req, err := http.NewRequest("PATCH", fmt.Sprintf("/server/%d", serverIDs[0]), bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatal(err)
	}

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Verify if the response status code is 409
	assert.Equal(t, http.StatusConflict, w.Code)

	DeleteTestServers()
}

func TestUpdateServer_WrongStatus(t *testing.T) {

	router := setupRouter()

	InsertTestServers()

	updateData := controllers.UpdateServerInput{Name: "Updated Server", Status: "wrong_status"}
	jsonData, _ := json.Marshal(updateData)
	req, err := http.NewRequest("PATCH", fmt.Sprintf("/server/%d", serverIDs[0]), bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatal(err)
	}

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code, "Status code should be 400")

	DeleteTestServers()
}

func TestUpdateServer_WrongId(t *testing.T) {

	router := setupRouter()

	updateData := controllers.UpdateServerInput{Name: "Updated Server", Status: "stopped"}
	jsonData, _ := json.Marshal(updateData)
	req, err := http.NewRequest("PATCH", fmt.Sprintf("/server/%d", 0), bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatal(err)
	}

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code, "Status code should be 404")
}

func TestFindServers(t *testing.T) {

	router := setupRouter()

	InsertTestServers()

	req, err := http.NewRequest("GET", "/servers", nil)
	if err != nil {
		t.Fatal(err)
	}

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code, "Status code should be OK")

	var response struct {
		Data []models.Server `json:"data"`
	}
	err = json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to parse response JSON: %v", err)
	}

	assert.GreaterOrEqual(t, len(response.Data), 3, "Number of servers should be at least 3")

	for _, id := range serverIDs {
		found := false
		for _, server := range response.Data {
			if server.ID == id {
				found = true
				break
			}
		}
		assert.True(t, found, "Server ID should be in the response")
	}

	DeleteTestServers()
}

func TestUpdateServerStatus(t *testing.T) {
	router := setupRouter()

	// Crée les serveurs de test
	InsertTestServers()

	// Définit le corps de la requête avec les données de mise à jour
	updateData := controllers.UpdateServerStatusInput{
		Ids:    serverIDs,
		Status: "stopped",
	}
	jsonData, _ := json.Marshal(updateData)

	// Envoie la requête PATCH
	req, err := http.NewRequest("PATCH", "/servers/status", bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatal(err)
	}

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Vérifie le code de statut de la réponse
	assert.Equal(t, http.StatusOK, w.Code, "Status code should be OK")

	// Vérifie que les serveurs ont été mis à jour avec le nouveau statut
	var updatedServers []models.Server
	models.DB.Where(updateData.Ids).Find(&updatedServers)
	for _, server := range updatedServers {
		assert.Equal(t, models.ServerStatus(updateData.Status), server.Status, "Server status should be updated")
	}

	// Supprime les serveurs utilisés pour les tests
	DeleteTestServers()
}

func TestUpdateServerStatus_WrongStatus(t *testing.T) {
	router := setupRouter()

	// Crée les serveurs de test
	InsertTestServers()

	// Définit le corps de la requête avec les données de mise à jour
	updateData := controllers.UpdateServerStatusInput{
		Ids:    serverIDs,
		Status: "wrong_status",
	}
	jsonData, _ := json.Marshal(updateData)

	// Envoie la requête PATCH
	req, err := http.NewRequest("PATCH", "/servers/status", bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatal(err)
	}

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Vérifie le code de statut de la réponse
	assert.Equal(t, http.StatusBadRequest, w.Code, "Status code should be 400")

	// Supprime les serveurs utilisés pour les tests
	DeleteTestServers()
}

func TestUpdateServerStatus_WrongId(t *testing.T) {
	router := setupRouter()
	InsertTestServers()

	// ID inexistant
	updateData := controllers.UpdateServerStatusInput{
		Ids:    []int64{9999},
		Status: "stopped",
	}
	jsonData, _ := json.Marshal(updateData)
	req, err := http.NewRequest("PATCH", "/servers/status", bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatal(err)
	}

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusNotFound, w.Code, "Status code should be 404")

	DeleteTestServers()
}

func TestUpdateServerStatus_NoId(t *testing.T) {
	router := setupRouter()
	InsertTestServers()

	// ID inexistant
	updateData := controllers.UpdateServerStatusInput{
		Ids:    []int64{},
		Status: "stopped",
	}
	jsonData, _ := json.Marshal(updateData)
	req, err := http.NewRequest("PATCH", "/servers/status", bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatal(err)
	}

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code, "Status code should be 400")

	DeleteTestServers()
}

func TestDeleteServer(t *testing.T) {
	router := setupRouter()

	// Create a test server
	server := models.Server{Name: "Test Server", Status: models.Running}
	models.DB.Create(&server)

	// Make a DELETE request to delete the server
	req, err := http.NewRequest("DELETE", fmt.Sprintf("/server/%d", server.ID), nil)
	if err != nil {
		t.Fatal(err)
	}

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Check the response status code
	assert.Equal(t, http.StatusOK, w.Code, "Status code should be OK")

	// Check if the server was deleted from the database
	var deletedServer models.Server
	if err := models.DB.Where("id = ?", server.ID).First(&deletedServer).Error; err == nil {
		t.Fatalf("Server with ID %d should be deleted", server.ID)
	}

	// Verify the response data
	var response struct {
		Data bool `json:"data"`
	}
	err = json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatal(err)
	}

	assert.True(t, response.Data, "Response data should be true")
}

func TestDeleteServer_WrongId(t *testing.T) {
	router := setupRouter()

	// Make a DELETE request to delete the server
	req, err := http.NewRequest("DELETE", "/server/9999", nil)
	if err != nil {
		t.Fatal(err)
	}

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Check the response status code
	assert.Equal(t, http.StatusNotFound, w.Code, "Status code should be 404")
}
