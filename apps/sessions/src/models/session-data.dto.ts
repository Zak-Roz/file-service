export class SessionDataDto {
  constructor(data: any) {
    this.userId = data.userId;
    this.sessionId = data.sessionId;
    this.email = data.email;
    this.isVerified = data.isVerified;
  }

  readonly userId: number;
  readonly sessionId: string;
  readonly email: string;
  readonly isVerified: boolean;
}
