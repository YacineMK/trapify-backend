import { CreateUserDto } from "@application/dto/create-user.dto";
import { LoggingInterceptor } from "@application/interceptors/logging.interceptor";
import { ApiResponse, ResponseHandler } from "@application/interfaces/response";
import { Context, LoggerService } from "@domain/services/logger.service";
import { UserService } from "@domain/services/User.service";
import { Controller, Get, Post, Body, UseInterceptors, Res, HttpStatus } from '@nestjs/common';


@Controller()
@UseInterceptors(LoggingInterceptor)
export class UserController {
    private Log: LoggerService = new LoggerService('createOperation');
    constructor(
        private readonly userService: UserService ,
        private readonly responseHandler: ResponseHandler
    ) {}

    @Get('/hello')
    async hello() {
        const context : Context = {
            module: 'UserController',
            method: 'hello'
        };
        this.Log.logger('Hello World!', context);
        return 'Hello World!';
    }

    @Post('/create')
    async createUser(@Body() user: CreateUserDto ) {
        const context: Context = {
            module: 'UserController',
            method: 'createUser'
        };
        this.Log.logger('Creating user', context);
        const createdUser = await this.userService.createUser(user);
        this.Log.logger('User created successfully', context);
        return ResponseHandler.success(createdUser, 'User created successfully', 'success', HttpStatus.CREATED);
    }

    @Get('/find')
    async findUser(@Res() res) {
        const context: Context = {
            module: 'UserController',
            method: 'findUser'
        };
        this.Log.logger('Finding user', context);
        const users = await this.userService.findUser();
        this.Log.logger('Users found successfully', context);
        return ResponseHandler.success(users, 'Users found successfully', 'success', HttpStatus.OK);
    }
}