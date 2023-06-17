export interface IJwtPayload {
    id: number;
    role_id: number;
    iat: number;
    exp: number;
}
export interface IJwtRefreshPayload {
    username: string;
    role_id: number;
    iat: number;
    exp: number;
}