import { BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/common/dto/create-user.dto";
import { User } from "src/common/entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';

export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<CreateUserDto>,
    ) { }

    async create(userData: CreateUserDto): Promise<User> {
        const { email, password } = userData;

        const existingUser = await this.userRepository.findOne({
            where: [{ email }],
        })

        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = this.userRepository.create({
            ...userData,
            password: hashedPassword,
        });
        return await this.userRepository.save(newUser);
    }

    async findUserByUsername(username: string): Promise<User | undefined> {
        return this.userRepository.findOneBy({ username });
    }
}