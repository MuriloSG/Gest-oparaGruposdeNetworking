import { IsString, IsNotEmpty } from 'class-validator';
import { CreateProfileDto } from './create-profile.dto';

export class CompleteRegistrationDto extends CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}