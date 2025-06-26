import { Injectable } from "@nestjs/common";    
import { UserModel } from "../models/user.model";
import { CreateUserDto } from "@application/dto/create-user.dto";

@Injectable()
export class UserRepository {
    constructor(
        private readonly userModel: typeof UserModel
    ) {}
    
    async excuteCreate(userData: CreateUserDto) {
        const user = new this.userModel(userData);
        return await user.save();
    }
    
    async excuteFind() {
        return await this.userModel.find();
    }
}
