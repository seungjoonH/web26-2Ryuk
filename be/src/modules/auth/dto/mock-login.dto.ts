import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class MockLoginDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class MockUserResponseDto {
  id: string;
  name: string;
  email?: string;
}
