package models

type ServerStatus string

const (
	Starting ServerStatus = "starting"
	Running  ServerStatus = "running"
	Stopping ServerStatus = "stopping"
	Stopped  ServerStatus = "stopped"
)
