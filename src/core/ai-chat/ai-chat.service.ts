import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { config } from '~/common/config';
import { DrizzleService } from '~/common/drizzle/drizzle.service';
import { aIChats } from '~/common/drizzle/schema/ai_chats';
import { uniqueKeyFile } from '~/common/utils';
import { AIChatResponse, CreateAIChatRequest } from '../models/ai-chat.model';
import { StorageService } from '../storage/storage.service';
import { UsersService } from '../users/users.service';
import Groq from 'groq-sdk';
import { desc } from 'drizzle-orm';

@Injectable()
export class AiChatService {
  constructor(
    private readonly usersService: UsersService,
    private readonly drizzleService: DrizzleService,
    private readonly storageService: StorageService,
  ) {}
  private readonly logger: Logger = new Logger(AiChatService.name);
  private readonly geminiGenAI = new GoogleGenerativeAI(
    config().AI.geminiApiKey,
  );
  private readonly geminiModel = this.geminiGenAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });
  private readonly groqGenAI = new Groq({ apiKey: config().AI.groqApiKey });
  //* Additional prompt to be added to the prompt provided by the user before sending to the AI model.
  private readonly additionalPrompt: string =
    'Anda adalah seorang agronom profesional bernama *Silani* yang akan menjawab pertanyaan dibawah ini sesuai dengan spesialisasi kamu secara profesional, dan berikan langkah-langkah spesifik terkait hal berikut serta secara singkat!.';

  /**
   * Generates a response using the Google Generative AI model based on the provided prompt and image.
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

    const prompt = `${this.additionalPrompt} ${createAIChatRequest.prompt}`;

    const imageParts = [];
    if (image?.buffer && image?.mimetype) {
      imageParts.push(this.fileToGenerativePart(image.buffer, image.mimetype));
    }

    const aIResponse = await this.geminiModel.generateContentStream([
      prompt,
      ...imageParts,
    ]);

    const response = (await aIResponse.response).text();

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
          prompt: createAIChatRequest.prompt,
          response,
          imageUrl: imageUploaded.url,
          imageKey: generateUniqueKeyFileName,
        })
        .returning();
      return {
        ...createdAiChat,
        model: 'Gemini-1.5-flash',
      };
    } catch (err) {
      this.logger.error(err);
      throw new Error(err);
    }
  }

  fileToGenerativePart(buffer: Buffer, mimeType: string) {
    return {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType,
      },
    };
  }

  /**
   * Generates a chat completion response using the Groq AI model.
   *
   * @param user - The user object for the current user.
   * @param createAIChatRequest - The request object containing the prompt for the chat completion.
   * @returns The created AI chat response, including the prompt, response, and model information.
   * @throws NotFoundException if the user is not found.
   * @throws Error if there is an error generating the chat completion.
   */
  async groqAI(user: any, createAIChatRequest: CreateAIChatRequest) {
    this.logger.debug(
      `AiChatService.groqAI(${user.user_email} create chat with data: ${JSON.stringify(createAIChatRequest)})`,
    );
    const isUserExist = await this.usersService.findByEmail(user.user_email);
    if (!isUserExist) {
      this.logger.error(`User ${user.user_email} not found`);
      throw new NotFoundException(`User ${user.user_email} not found`);
    }
    const prompt = `${this.additionalPrompt} ${createAIChatRequest.prompt}`;

    try {
      const chatCompletion = await this.getGroqChatCompletion(prompt);

      let response = '';
      for await (const chunk of chatCompletion) {
        response += chunk.choices[0]?.delta?.content || '';
      }
      const [createdAiChat] = await this.drizzleService.db
        .insert(aIChats)
        .values({
          userId: isUserExist.id,
          prompt: createAIChatRequest.prompt,
          response,
        })
        .returning();
      return {
        ...createdAiChat,
        model: 'Groq: llama3-70b-8192',
      };
    } catch (err) {
      this.logger.error(err);
      throw new Error(err);
    }
  }

  getGroqChatCompletion(prompt: string) {
    return this.groqGenAI.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama3-70b-8192',
      stream: true,
    });
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
          orderBy: [desc(aIChats.createdAt)],
        },
      },
    });
    return result;
  }
}
