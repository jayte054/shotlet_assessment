import { IsNotEmpty, IsString } from 'class-validator';

export interface authObject {
  id: string;
  username: string;
  apiKey: string;
}

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
