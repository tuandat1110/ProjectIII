import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UpdateAvatarDto } from './dto/update-avatar-dto';

@Controller('accounts')
export class AccountController {
    constructor(private accountService: AccountService) {}
    @ApiOperation({ summary: 'Get all accounts' })
    @ApiResponse({ status: 200, description: 'List of all accounts' })
    @Get()
    async getAllAccounts() {
        return this.accountService.getAllAccounts();
    }

    @Post()
    async createAccount(@Body() createAccountDto: CreateAccountDto) {
        return this.accountService.createAccount(createAccountDto);
    }
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async updateAccount(@Param('id') id: number, @Body() updateAccountDto: CreateAccountDto) {
        return this.accountService.updateAccount(Number(id), updateAccountDto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    async updateAvatar(@Param('id') id: number, @Body() avatar: UpdateAvatarDto) {
        return this.accountService.updateAvatar(Number(id), avatar?.avatarUrl);
    }

    @Delete(':id')
    async deleteAccount(@Param('id') id: number) {
        return this.accountService.deleteAccount(Number(id));
    }
    
    @Get(':id/houses')
    async getHousesByAccountId(@Param('id') id: number) {
        console.log(id);
        return this.accountService.getHousesByAccountId(Number(id));
    }
}
