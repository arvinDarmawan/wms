import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateWarehouseDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30, { message: "Name must be at most 30 characters" })
  @ApiProperty({ description: "The name of the warehouse" })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "The address of the warehouse" })
  address: string;
}
