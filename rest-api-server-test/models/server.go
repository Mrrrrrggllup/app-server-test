package models

type Server struct {
	ID     int64        `json:"id" gorm:"primary_key"`
	Name   string       `json:"name"`
	Type   ServerType   `json:"type"`
	Status ServerStatus `json:"status"`
}
