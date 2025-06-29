import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { UserCredentialDto } from 'src/common/dtos/userCredential.dto';
import { Request, Response } from 'express';
import { Auth0Guard } from 'src/common/guards/auth0.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Get('login')
  async login(@Res() res: Response) {
    try {
      // ✅ Correcto: await + try/catch
      await res.oidc.login({
        returnTo: 'http://localhost:3000/dashboard/user',
        authorizationParams: {
          redirect_uri: 'http://localhost:4000/auth/callback',
          //prompt: 'login', // 👈 obliga a mostrar el formulario SIEMPRE 
          //connection: 'google-oauth2', // 👈 evita SSO silencioso
        },
      });
    } catch (err) {
      console.error('Auth0 login failed:', err);
      res.status(500).send('Login failed');
    }
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    await res.oidc.logout({
      returnTo: 'http://localhost:3000', // 👈 Esta debe estar en Allowed Logout URLs
    });
  }

  /**    const returnTo = encodeURIComponent('http://localhost:3000/');
    const logoutUrl = `https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${returnTo}&federated=true`;

    return res.redirect(logoutUrl); // redirige al logout global de Auth0 */

  @Get('callback')
  @UseGuards(Auth0Guard)
  callback( @Res() res: Response) {
    return res.redirect('http://localhost:3000/dashboard');
  }

  @Get('me')
  @UseGuards(Auth0Guard)
  getMe(@Req() req: Request) {
    console.log(req.oidc.user)
    return req.oidc.user; 
  }

  @Post('signup')
  async signup(@Body() createUser: any) {
    return await this.usersService.createUser(createUser); 
  }

  @Post('signin')
  async signin(@Body() loginUser: UserCredentialDto) {
    return await this.authService.signin(loginUser);
  }
}
