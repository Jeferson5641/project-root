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
        const { email, password, username } = userData;

        const existingUser = await this.userRepository.findOne({
            where: { email },
        })

        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }
        const saltRouds = 10;
        const salt = await bcrypt.genSalt(saltRouds);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = this.userRepository.create({
            email,
            username,
            password: hashedPassword,
        });
        console.log('Creating new user: ', newUser);

        const saveUser = await this.userRepository.save(newUser);
        console.log('User created: ', saveUser);
        return saveUser;
    }

    async findUserByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { email } });
    }
}