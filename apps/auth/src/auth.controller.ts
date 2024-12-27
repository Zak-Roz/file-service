import { Controller, Get, UseGuards, Req, Res, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'apps/users/src/users.service';
import { SessionsService } from 'apps/sessions/src/sessions.service';
import { Public } from 'apps/common/src/resources/common/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { FoldersService } from 'apps/folders/src/folders.service';
import { Sequelize } from 'sequelize';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly foldersService: FoldersService,
    @Inject('SEQUELIZE') readonly dbConnection: Sequelize,
  ) {}

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Only redirects to Google
  }

  @Public()
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    return this.dbConnection.transaction(async (transaction) => {
      const user = await this.usersService.getUserByEmailOrCreate(
        req.user,
        transaction,
      );

      const session = await this.sessionsService.create(user.id, {
        email: user.email,
        isVerified: user.isVerified,
      });

      // create a root folder for the user
      await this.foldersService.createRootFolder(user.id, transaction);

      return res.redirect(
        `/swagger?accessToken=${session.accessToken}&refreshToken=${session.refreshToken}`,
      );
    });
  }
}
