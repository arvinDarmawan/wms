import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUomDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(8, { message: "Name must be at most 8 characters" })
  @ApiProperty({ description: "The code of the uom" })
  code: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15, { message: "Name must be at most 15 characters" })
  @ApiProperty({ description: "The name of the uom" })
  name: string;
}
