import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { config } from '~/common/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: config().clerk.url,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: config().clerk.url,
      algorithms: ['RS256'],
    });
    console.log('JwtStrategy initialized');
  }

  validate(payload: unknown): unknown {
    // This one is really useful to check the jwt payload!
    // console.log('Validating payload:', payload);
    return payload;
  }
}
