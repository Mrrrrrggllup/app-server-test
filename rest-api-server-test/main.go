package main

import (
	"homeAssignement/rest-api-server-test/controllers"
	"homeAssignement/rest-api-server-test/models"
	repository "homeAssignement/rest-api-server-test/repositories"
	"homeAssignement/rest-api-server-test/services"
	"net/http"

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

func allowCors(c *gin.Context) {
	c.Header("Access-Control-Allow-Methods", "*")
	c.Header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	c.Status(http.StatusOK)
}

func handleOptionCorsIssue(r *gin.Engine) {
	r.OPTIONS("/server", allowCors)
	r.OPTIONS("/servers/status", allowCors)
	r.OPTIONS("/server/:id", allowCors)
	r.OPTIONS("/servers", allowCors)
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
	serverRepo := repository.NewServerRepository(models.DB)
	serverService := services.NewServerService(serverRepo)
	ctrl := controllers.NewServerController(serverService)

	// Middleware CORS
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "*")
		c.Next()
	})

	// Routes
	r.GET("/servers", ctrl.FindServers)
	r.POST("/server", ctrl.CreateServer)
	r.GET("/server/:id", ctrl.FindServerByID)
	r.PUT("/server/:id", ctrl.UpdateServer)
	r.PUT("/servers/status", ctrl.UpdateServerStatus)
	r.DELETE("/server/:id", ctrl.DeleteServer)
	r.DELETE("/servers", ctrl.DeleteServers)

	// Prevent CORS issue
	handleOptionCorsIssue(r)

	return r
}

func main() {
	r := setupRouter()

	r.Run()
}
