import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { config } from '~/common/config';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import { aIChats } from '~/common/drizzle/schema/ai-chats';
import { uniqueKeyFile } from '~/common/utils';
import { AIChatResponse, CreateAIChatRequest } from '../models/ai-chat.model';
import { StorageService } from '../storage/storage.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AiChatService {
  constructor(
    private readonly usersService: UsersService,
    private readonly drizzleService: DrizzleService,
    private readonly storageService: StorageService,
  ) {}
  private readonly logger: Logger = new Logger(AiChatService.name);
  private readonly genAI = new GoogleGenerativeAI(config().google.geminiApiKey);
  private readonly model = this.genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });

  /**
   * Generates a response using the Google Generative AI model based on the provided prompt and optional image.
   *
   * @param user - The user object associated with the request.
   * @param createAIChatRequest - The request object containing the prompt and other details.
   * @param image - The optional image file attached to the request.
   * @returns The generated AI chat response.
   */
  async geminiAI(
    user: any,
    createAIChatRequest: CreateAIChatRequest,
    image: Express.Multer.File,
  ): Promise<AIChatResponse> {
    this.logger.debug(
      `AiChatService.geminiAI(${user.user_email} create chat with data: ${JSON.stringify(createAIChatRequest)}, with image ${image.originalname})`,
    );

    const isUserExist = await this.usersService.findByEmail(user.user_email);
    if (!isUserExist) {
      this.logger.error(`User ${user.user_email} not found`);
      throw new NotFoundException(`User ${user.user_email} not found`);
    }

    const prompt = createAIChatRequest.prompt;

    const imageParts = [];
    if (image?.buffer && image?.mimetype) {
      imageParts.push(this.fileToGenerativePart(image.buffer, image.mimetype));
    }

    const aIResponse = await this.model.generateContentStream([
      prompt,
      ...imageParts,
    ]);

    let response = '';
    for await (const chunk of aIResponse.stream) {
      const chunkText = chunk.text();
      console.log(chunkText);
      response += chunkText;
    }

    const generateUniqueKeyFileName = uniqueKeyFile(
      'ai-chat',
      image.originalname,
    );
    try {
      const imageUploaded = await this.storageService.upload(
        generateUniqueKeyFileName,
        image.buffer,
        image.mimetype,
      );
      const [createdAiChat] = await this.drizzleService.db
        .insert(aIChats)
        .values({
          userId: isUserExist.id,
          prompt,
          response,
          imageUrl: imageUploaded.url,
          imageKey: generateUniqueKeyFileName,
        })
        .returning();
      return createdAiChat;
    } catch (err) {
      this.logger.error(err);
      throw new Error(err);
    }
  }

  async getAll(user: any) {
    this.logger.debug(`AiChatService.getAll(${user.user_email})`);
    const userEmail = user.user_email;
    const result = await this.drizzleService.db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, userEmail),
      with: {
        aIChats: {
          columns: {
            userId: false,
          },
        },
      },
    });
    return result;
  }

  fileToGenerativePart(buffer: Buffer, mimeType: string) {
    return {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType,
      },
    };
  }
}
