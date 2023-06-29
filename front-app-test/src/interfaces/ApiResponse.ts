interface ApiBody<T> {
    body: T;
}

export default interface ApiResponse<T> {
    data: ApiBody<T>;
    error: string;
}