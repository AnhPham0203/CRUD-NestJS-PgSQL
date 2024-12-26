import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // jwtFromRequest: (req) => {
      //   console.log('Request Headers:', req.headers);
      //   const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      //   console.log('Extracted JWT:', token);
      //   return token;
      // },
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }


  async validate(payload: any) {
    console.log("ádas",payload);
    
    return { sub: payload.sub, username: payload.username, role: payload.role }; // Gán thông tin vào return
    
  }
}
