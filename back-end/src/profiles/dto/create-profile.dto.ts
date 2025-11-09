import { IsString, IsOptional, IsArray, IsUrl } from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  professional_area?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @IsOptional()
  @IsUrl()
  linkedin_url?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsString()
  goals?: string;

  @IsOptional()
  @IsString()
  business_size?: string;

  @IsOptional()
  @IsString()
  target_audience?: string;
}