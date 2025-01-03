import { Injectable } from "@nestjs/common";

@Injectable()
export class InMemoryDBService {
    private users = [];

    findOneByUsername(username: string) {
        return this.users.find(user => user.username === username);
    }

    addUser(user: { username: string; password: string; email: string }): void {
        this.users.push(user);
    }

    getAllUsers(): Array<{ username: string; password: string; email: string }> {
        return this.users;
    }

    findByEmail(email: string): { username: string; password: string; email: string } | undefined {
        return this.users.find(user => user.email === email);
    }

    save(user: any) {
        this.users.push(user);
        return user;
    }

    clear(): void {
        this.users = [];
    }
}