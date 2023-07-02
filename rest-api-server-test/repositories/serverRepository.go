package repository

import (
	"fmt"
	"homeAssignement/rest-api-server-test/models"

	"gorm.io/gorm"
)

type ServerRepository interface {
	FindAll() ([]models.Server, error)
	FindByName(name string) (*models.Server, error)
	Create(server *models.Server) error
	FindByID(id int64) (*models.Server, error)
	FindByIDs(ids []int64) ([]models.Server, error)
	Update(server *models.Server) error
	UpdateAll(server *[]models.Server) error
	Delete(server *models.Server) error
	DeleteServers(ids []int64) error
}

type serverRepository struct {
	DB *gorm.DB
}

func (r *serverRepository) GetDB() *gorm.DB {
	return r.DB
}

func NewServerRepository(db *gorm.DB) ServerRepository {
	return &serverRepository{
		DB: db,
	}
}

func (r *serverRepository) Create(server *models.Server) error {
	// Check if the server name already exists
	var existingServer models.Server
	if err := r.DB.Where("name = ?", server.Name).First(&existingServer).Error; err == nil {
		return fmt.Errorf("server name %s already exists", server.Name)
	}

	if err := r.DB.Create(server).Error; err != nil {
		return err
	}

	return nil
}

func (r *serverRepository) FindByName(name string) (*models.Server, error) {
	var server models.Server
	err := r.DB.Where("name = ?", name).First(&server).Error
	return &server, err
}

func (r *serverRepository) FindAll() ([]models.Server, error) {
	var servers []models.Server
	if err := r.DB.Find(&servers).Error; err != nil {
		return nil, err
	}
	return servers, nil
}

func (r *serverRepository) FindByID(id int64) (*models.Server, error) {
	var server models.Server
	if err := r.DB.Where("id = ?", id).First(&server).Error; err != nil {
		return nil, err
	}
	return &server, nil
}

func (r *serverRepository) Update(server *models.Server) error {
	return r.DB.Save(server).Error
}

func (r *serverRepository) UpdateAll(server *[]models.Server) error {
	return r.DB.Save(server).Error
}

func (r *serverRepository) FindByIDs(ids []int64) ([]models.Server, error) {
	var servers []models.Server
	if err := r.DB.Where("id IN (?)", ids).Find(&servers).Error; err != nil {
		return nil, err
	}
	return servers, nil
}

func (r *serverRepository) Delete(server *models.Server) error {
	return r.DB.Delete(server).Error
}

func (r *serverRepository) DeleteServers(ids []int64) error {
	return r.DB.Where(ids).Delete(&models.Server{}).Error
}
