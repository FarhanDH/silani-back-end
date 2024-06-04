import { WebhookEvent } from '@clerk/clerk-sdk-node';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Webhook } from 'svix';
import { config } from '~/common/config';
import { UsersService } from '../users/users.service';
import { RegisterUserRequest } from '../models/user.model';

@Injectable()
export class WebhooksService {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger: Logger = new Logger(WebhooksService.name);

  async clerkEvents(request: any) {
    const payload = request.rawBody.toString('utf8');
    const headers = request.headers;

    // Get the Svix headers for verification
    const svix_id = headers['svix-id'] as string;
    const svix_timestamp = headers['svix-timestamp'] as string;
    const svix_signature = headers['svix-signature'] as string;

    // If there are no Svix headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error occured -- no svix headers', {
        status: 400,
      });
    }

    // Create a new Svix instance with your secret.
    const wh = new Webhook(config().webhook.secret);

    let evt: WebhookEvent;

    // Attempt to verify the incoming webhook
    // If successful, the payload will be available from 'evt'
    // If the verification fails, error out and  return error code
    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (err: any) {
      this.logger.error('Error verifying webhook:', err.message);
      throw new BadRequestException({
        success: false,
        message: err.message,
      });
    }

    // Do something with the payload
    // For this guide, you simply log the payload to the console
    const { id } = evt.data;
    const eventType = evt.type;
    this.logger.debug({ eventType });
    this.logger.debug(`Webhook with an ID of ${id} and type of ${eventType}`);
    this.logger.debug('Webhook body:', evt.data);

    // If the event type is 'user.created' then save user to db,
    if (eventType === 'user.created') {
      const registerUser: RegisterUserRequest = {
        email: evt.data.email_addresses[0].email_address,
        fullName: evt.data.first_name || '',
        avatarUrl: evt.data.image_url,
      };

      return await this.usersService.registerUser(registerUser);
    }

    return {
      success: true,
      eventType,
      data: evt.data,
    };
  }
}
