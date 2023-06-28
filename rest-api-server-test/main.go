package main

import (
	"homeAssignement/rest-api-server-test/controllers"
	"homeAssignement/rest-api-server-test/models"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

func validateServerType(fl validator.FieldLevel) bool {
	// Récupère la valeur du champ "type"
	serverType := fl.Field().String()
	if serverType == "" {
		return true
	}

	// Vérifie si la valeur correspond à un type de serveur valide
	switch serverType {
	case "small", "medium", "large":
		return true
	default:
		return false
	}
}

func validateServerStatus(fl validator.FieldLevel) bool {
	// Récupère la valeur du champ "type"
	serverStatus := fl.Field().String()

	if serverStatus == "" {
		return true
	}

	// Vérifie si la valeur correspond à un type de serveur valide
	switch serverStatus {
	case "starting", "running", "stopping", "stopped":
		return true
	default:
		return false
	}
}

func setupRouter() *gin.Engine {
	r := gin.Default()
	// Enregistre la fonction de validation personnalisée
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("validServerTypeValue", validateServerType)
	}
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("validServerStatusValue", validateServerStatus)
	}
	models.ConnectDatabase()

	// Routes

	r.GET("/servers", controllers.FindServers)
	r.POST("/server", controllers.CreateServer)
	r.GET("/server/:id", controllers.FindServer)
	r.PATCH("/server/:id", controllers.UpdateServer)
	r.PATCH("/servers/status", controllers.UpdateServerStatus)
	r.DELETE("/server/:id", controllers.DeleteServer)

	return r
}

func main() {
	r := setupRouter()

	models.ConnectDatabase()

	r.Run()
}
