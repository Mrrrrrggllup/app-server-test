package models

type UpdateServerStatusInput struct {
	Ids    []int64      `json:"ids" binding:"required,min=1"`
	Status ServerStatus `json:"status" binding:"required,validServerStatusValue"`
}
