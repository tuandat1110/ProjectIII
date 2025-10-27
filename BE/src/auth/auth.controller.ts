import { Body, Controller, Post, UseGuards, Request, Get  } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AccountService } from "src/account/account.service";
import { CreateAccountDto } from "src/account/dto/create-account.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private accountService: AccountService
    ) {}
    @UseGuards(AuthGuard('local'))  
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('register')
    async register(@Body() body: CreateAccountDto) {
        return this.accountService.createAccount(body);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('accounts')
    async getAllAccounts(@Request() req) {
        return this.accountService.getAllAccounts();
    }
}