import { IsString, IsNotEmpty } from 'class-validator';

export class RoomJoinDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;
}

export class RoomLeaveDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;
}
