package services

import (
	"fmt"
	"homeAssignement/rest-api-server-test/models"
	repository "homeAssignement/rest-api-server-test/repositories"
)

type ServerService interface {
	GetAllServers() ([]models.Server, error)
	CreateServer(input models.CreateServerInput) (*models.Server, error)
	FindServerByID(id int64) (*models.Server, error)
	UpdateServer(id int64, input models.UpdateServerInput) (*models.Server, error)
	UpdateServerStatus(input models.UpdateServerStatusInput) ([]models.Server, error)
	DeleteServer(id int64) error
	DeleteServers(ids []int64) error
}

type serverService struct {
	serverRepo repository.ServerRepository
}

func NewServerService(serverRepo repository.ServerRepository) ServerService {
	return &serverService{
		serverRepo: serverRepo,
	}
}

func (s *serverService) GetAllServers() ([]models.Server, error) {
	return s.serverRepo.FindAll()
}

func (s *serverService) CreateServer(input models.CreateServerInput) (*models.Server, error) {
	_, err := s.serverRepo.FindByName(input.Name)
	if err != nil && err.Error() != "record not found" {
		return nil, err
	}

	if err == nil {
		return nil, fmt.Errorf("server name %s already exists", input.Name)
	}

	fmt.Println("On a pâs crash au server name 2")

	server := &models.Server{
		Name:   input.Name,
		Type:   models.ServerType(input.Type),
		Status: models.ServerStatus(input.Status),
	}

	err = s.serverRepo.Create(server)
	if err != nil {
		return nil, err
	}

	fmt.Println("On a pâs crash au server name 3")

	return server, nil
}

func (s *serverService) FindServerByID(id int64) (*models.Server, error) {
	server, err := s.serverRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	return server, nil
}

func (s *serverService) UpdateServer(id int64, input models.UpdateServerInput) (*models.Server, error) {
	server, err := s.FindServerByID(id)
	if err != nil {
		return nil, err
	}

	if input.Name != server.Name {
		_, err := s.serverRepo.FindByName(input.Name)
		if err != nil && err.Error() != "record not found" {
			return nil, err
		}

		if err == nil {
			return nil, fmt.Errorf("server name %s already exists", input.Name)
		}
	}

	server.Name = input.Name
	server.Type = models.ServerType(input.Type)
	server.Status = models.ServerStatus(input.Status)

	if err := s.serverRepo.Update(server); err != nil {
		return nil, err
	}

	return server, nil
}

func (s *serverService) UpdateServerStatus(input models.UpdateServerStatusInput) ([]models.Server, error) {
	servers, err := s.serverRepo.FindByIDs(input.Ids)
	if err != nil {
		return nil, err
	}

	if err := validateServerIDs(input.Ids, servers); err != nil {
		return nil, err
	}

	for i := range servers {
		servers[i].Status = input.Status
	}

	if err := s.serverRepo.UpdateAll(&servers); err != nil {
		return nil, err
	}

	return servers, nil
}

func (s *serverService) DeleteServer(id int64) error {
	server, err := s.serverRepo.FindByID(id)
	if err != nil {
		return err
	}

	return s.serverRepo.Delete(server)
}

func (s *serverService) DeleteServers(ids []int64) error {
	return s.serverRepo.DeleteServers(ids)
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
