import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from '~/common/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: config().google.clientId,
      clientSecret: config().google.clientSecret,
      callbackURL: config().google.callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { displayName, emails, photos, id } = profile;

    const user = {
      email: emails[0].value,
      fullName: displayName,
      avatarUrl: photos[0].value,
      googleId: id,
      accessToken,
    };
    return done(null, user);
  }
}
