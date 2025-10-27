import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
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

    async updateAccount(@Param('id') id: number, @Body() updateAccountDto: CreateAccountDto) {
        return this.accountService.updateAccount(Number(id), updateAccountDto);
    }

    @Delete(':id')
    async deleteAccount(@Param('id') id: number) {
        return this.accountService.deleteAccount(Number(id));
    }

}
