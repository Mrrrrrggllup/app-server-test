package models

type UpdateServerInput struct {
	Name   string `json:"name" binding:"required"`
	Type   string `json:"type" binding:"required,validServerTypeValue"`
	Status string `json:"status" binding:"required,validServerStatusValue"`
}
