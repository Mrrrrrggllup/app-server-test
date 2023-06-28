package models

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {

	dbURL := "postgres://admin:admin@localhost:5432/rest-api-server-test"
	database, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to database!")
	}

	err = database.AutoMigrate(&Server{})
	if err != nil {
		return
	}

	DB = database
}
