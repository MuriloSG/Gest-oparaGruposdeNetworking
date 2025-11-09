import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateGroupDto {
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name!: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  description?: string;
}
