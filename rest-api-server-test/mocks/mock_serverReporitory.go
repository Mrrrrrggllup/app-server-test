package mocks

import (
	"homeAssignement/rest-api-server-test/models"

	"github.com/stretchr/testify/mock"
)

type MockServerRepository struct {
	mock.Mock
}

func (m *MockServerRepository) FindAll() ([]models.Server, error) {
	args := m.Called()
	return args.Get(0).([]models.Server), args.Error(1)
}

func (m *MockServerRepository) FindByName(name string) (*models.Server, error) {
	args := m.Called(name)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.Server), args.Error(1)
}

func (m *MockServerRepository) Create(server *models.Server) error {
	args := m.Called(server)
	return args.Error(0)
}

func (m *MockServerRepository) FindByID(id int64) (*models.Server, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.Server), args.Error(1)
}

func (m *MockServerRepository) FindByIDs(ids []int64) ([]models.Server, error) {
	args := m.Called(ids)
	return args.Get(0).([]models.Server), args.Error(1)
}

func (m *MockServerRepository) Update(server *models.Server) error {
	args := m.Called(server)
	return args.Error(0)
}

func (m *MockServerRepository) UpdateAll(server *[]models.Server) error {
	args := m.Called(server)
	return args.Error(0)
}

func (m *MockServerRepository) Delete(server *models.Server) error {
	args := m.Called(server)
	return args.Error(0)
}

func (m *MockServerRepository) DeleteServers(ids []int64) error {
	args := m.Called(ids)
	return args.Error(0)
}
