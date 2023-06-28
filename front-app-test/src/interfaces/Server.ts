export type ServerStatus = 'starting' | 'running' | 'stopping' | 'stopped';
export type ServerType = 'small' | 'medium' | 'large';

export default interface Server {
    id: number;
    name: string;
    status: ServerStatus;
    type: ServerType;
}