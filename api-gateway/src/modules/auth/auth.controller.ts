import { HttpService } from "@nestjs/axios";
import { Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { Request, Response } from 'express';

export class AuthController {
    constructor(private httpService: HttpService) { }

    @Post('login')
    async login(@Req() req: Request, @Res() res: Response) {
        const { data } = await this.httpService.post('http://localhost:3001/', req.body).toPromise(); // quando usar docker usar 'http://login-service:3001/'
        return res.send(data);
    }

    @Get('data')
    @UseGuards(AuthGuard)
    async getData(@Req() req: Request, @Res() res: Response) {
        const { data } = await this.httpService.get('http://localhost:3002/', { headers: req.headers }).toPromise(); // quando usar docker usar 'http://data-service:3002/'
        return res.send(data);
    }
}