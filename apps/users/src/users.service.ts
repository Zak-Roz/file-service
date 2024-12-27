import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, ICreateUser } from './models';
import { BaseService } from 'apps/common/src/base/base.service';
import { Repository } from 'sequelize-typescript';
import { ScopeOptions, Transaction } from 'sequelize';
import { ConfigService } from 'apps/common/src/utils/config/config.service';
import { TranslatorService } from 'nestjs-translator';
import { userProvider } from './models/user.provider';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    private readonly configService: ConfigService,
    private readonly translator: TranslatorService,
    @Inject(userProvider.provide) protected model: Repository<User>,
  ) {
    super(model);
  }

  getUserByEmail(
    email: string,
    scopes?: any[],
    transaction?: Transaction,
  ): Promise<User | null> {
    return this.model.scope(scopes || []).findOne({
      where: { email },
      transaction,
    });
  }

  async getUserByEmailOrCreate(
    body: ICreateUser,
    transaction?: Transaction,
  ): Promise<User> {
    const user = await this.getUserByEmail(body.email, [], transaction);

    if (user) {
      return user;
    }

    return this.create(body, transaction);
  }

  create(body: ICreateUser, transaction?: Transaction): Promise<User> {
    return this.model.create({ ...body, isVerified: true }, { transaction });
  }

  getUser(
    userId: number,
    scopes?: any[],
    transaction?: Transaction,
  ): Promise<User> {
    return this.model.scope(scopes || []).findByPk(userId, { transaction });
  }

  async getExistingInstanceOrThrow(
    id: number,
    scopes: (string | ScopeOptions)[] = [],
    transaction?: Transaction,
  ): Promise<User> {
    const user: User = await this.getById(id, scopes, transaction);

    if (!user) {
      throw new NotFoundException({
        message: this.translator.translate('USER_NOT_FOUND'),
        errorCode: 'USER_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return user;
  }
}
