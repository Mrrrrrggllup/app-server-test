import { ServerStatus } from "./Server";

export default interface UpdateServerStatusPayload {
    ids: number[];
    status: ServerStatus;
}