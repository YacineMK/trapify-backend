import { CreateUserDto } from "@application/dto/create-user.dto";
import { User } from "@domain/entities/User";
import { UserRepository } from "@infrastructure/repository/user.repository";

export class UserService {
    constructor(
        private readonly userRepository: UserRepository
    ) {}
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        return await this.userRepository.excuteCreate(createUserDto);
    }
    async findUser() {
        return await this.userRepository.excuteFind();
    }
}