import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class FileExtender implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    req.file['folderId'] = +req.body.folderId;
    req.file['isPublic'] = req.body.isPublic === 'true';
    return next.handle();
  }
}
