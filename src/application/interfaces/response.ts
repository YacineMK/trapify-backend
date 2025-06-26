export interface ApiResponse<T = any> {
    status: string;
    message: string;
    data?: T;
    error?: string;
    code: number;
}

export class ResponseHandler {
    static success<T>(
        data: T, 
        message: string, 
        status: string ,
        code: number
    ): ApiResponse<T> {
        return {
            status,
            message,
            data,
            code,
        };
    }

    static error(
        error: string, 
        message: string , 
        status: string ,
        code : number
    ): ApiResponse<never> {
        return {
            status,
            message,
            error,
            code,
        };
    }
}