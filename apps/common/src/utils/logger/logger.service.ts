import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';

@Injectable()
export class LoggerService extends ConsoleLogger {
  constructor(@Inject(INQUIRER) source?: string | object) {
    super(typeof source === 'string' ? source : source?.constructor?.name);
  }
}
