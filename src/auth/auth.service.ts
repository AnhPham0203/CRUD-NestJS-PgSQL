
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareHashPasswordHelper } from 'src/helpers/util';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService,
    private jwtService: JwtService
  ) { }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(username);
    const isValidPassword = await compareHashPasswordHelper(pass, user.password)
 
    if (!isValidPassword) return null;

    return user;
   
  }


  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    const isValidPassword = await compareHashPasswordHelper(pass, user.password)
   
    
    if (!isValidPassword) {
      throw new UnauthorizedException("email/password invalid");
    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
