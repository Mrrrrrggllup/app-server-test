import ApiResponse from "../interfaces/ApiResponse";
import Server from "../interfaces/Server";
import UpdateServerStatusPayload from "../interfaces/UpdateServerStatusPayload";

const API_URL = 'http://localhost:8000';

export function fetchServers() : Promise<ApiResponse<Server[]>> {
    const url = `${API_URL}/servers`;
    return fetch(url)
    .then((res) => res.json())
    .then((res) => {
        return {data : { body : res.data}}
    })
    .catch((err) => {
        return {
            error: err.message
        };
    });
}

export function fetchServer(id: number) : Promise<ApiResponse<Server>> {
    const url = `${API_URL}/server/${id}`;
    return fetch(url)
    .then((res) => res.json())
    .then((res) => {
        return {data : { body : res.data}}
        })
    .catch((err) => {
        return {
            error: err.message
        };
    });
}

export function createServer(server: Server) : Promise<ApiResponse<Server>> {
    const url = `${API_URL}/server`;
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(server)
    })
    .then((res) => res.json())
    .catch((err) => {
        return {
            error: err.message
        };
    });
}

export function updateServer(server: Server) : Promise<ApiResponse<Server>> {
    const url = `${API_URL}/server/${server.id}`;
    return fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(server)
    })
    .then((res) => res.json())
    .then((res) => {
        return {data : { body : res.data}}
    })
    .catch((err) => {
        return {
            error: err.message
        };
    });
}

export function deleteServer(id: number) : Promise<ApiResponse<boolean>> {
    const url = `${API_URL}/server/${id}`;
    return fetch(url, {
        method: 'DELETE'
    })
    .then((res) => res.json())
    .then((res) => {
        return {data : { body : res.data}}
    })
    .catch((err) => {
        return {
            error: err.message
        };
    });
}

export function deleteServers(ids: number[]) : Promise<ApiResponse<boolean>> {
    const url = `${API_URL}/servers`;
    return fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ids)
    })
    .then((res) => res.json())
    .then((res) => {
        return {data : { body : res.data}}
    })
    .catch((err) => {
        return {
            error: err.message
        };
    });
}

export function updateServersStatus(body: UpdateServerStatusPayload) : Promise<ApiResponse<Server[]>> {
    const url = `${API_URL}/servers/status`;
    return fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
    .then((res) => res.json())
    .then((res) => {
        return {data : { body : res.data}}
    })
    .catch((err) => {
        return {
            error: err.message
        };
    });
}