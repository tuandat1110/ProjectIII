import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('account')
export class AccountController {
    constructor(private accountService: AccountService) {}
    
    @Get()
    async getAllAccounts() {
        return this.accountService.getAllAccounts();
    }

    @Post()
    async createAccount(@Body() createAccountDto: CreateAccountDto) {
        return this.accountService.createAccount(createAccountDto);
    }

    @Delete(':id')
    async deleteAccount(@Param('id') id: number) {
        return this.accountService.deleteAccount(Number(id));
    }

}
