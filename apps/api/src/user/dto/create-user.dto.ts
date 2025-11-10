import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "The name of the user" })
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: "The email of the user" })
  email: string;
}
