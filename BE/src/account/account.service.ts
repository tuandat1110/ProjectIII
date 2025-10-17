import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountService {
    constructor(private prisma: PrismaService) {}
    
    async getAllAccounts() {
        return this.prisma.account.findMany();
    }

    async createAccount(accountData: CreateAccountDto) {
        const hashedPassword = await bcrypt.hash(accountData.password, 10);
        return this.prisma.account.create({
            data: {
                email: accountData.email,
                password: hashedPassword,
            }
        });
    }

    async deleteAccount(id: number) {
        return this.prisma.account.delete({
            where: { id: id }
        });
    }
    
}
