import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserCredentialDto } from '../common/dtos/userCredential.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

<<<<<<< HEAD
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
    const logoutUrl = https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${returnTo}&federated=true;

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

=======
>>>>>>> 024bc6cbb06591ae5be0325f0f51d89eb21b998f
  @Post('signup')
  async signup(@Body() createUser: any) {
    return await this.usersService.createUser(createUser);
  }

  @Post('signin')
  async signin(@Body() loginUser: UserCredentialDto) {
    return await this.authService.signin(loginUser);
  }
}
