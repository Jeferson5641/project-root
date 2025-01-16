import { BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/common/dto/create-user.dto";
import { User } from "src/common/entities/user.entity";
import { Repository } from "typeorm";

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
        console.log(existingUser);

        const newUser = this.userRepository.create({
            email,
            username,
            password,
        });
        console.log('Creating new user: ', newUser);

        const saveUser = await this.userRepository.save(newUser);
        console.log('User created: ', saveUser);
        return saveUser;
    }

    async findUserByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { email } });
    }

    async findAllUser(): Promise<any[]> {
        return await this.userRepository.find();
    }

    async findUserById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async updateUser(id: number, updateData: Partial<CreateUserDto>): Promise<void> {
        const user = await this.userRepository.findOneBy({ id }); // Reutiliza o método `findUserById` para validação

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        Object.assign(user, updateData);
        await this.userRepository.save(user);
    }

    async deleteUser(id: number): Promise<void> {
        console.log(`Service: Deleting user with ID ${id}`);
        const user = await this.findUserById(id); // Valida a existência do usuário

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        await this.userRepository.delete(user.id);

        console.log(`Received request to delete user with ID ${id}(service)`);// Remove o usuário do banco de dados
    }
}