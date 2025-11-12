import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateWarehouseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "The code of the warehouse" })
  code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "The name of the warehouse" })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "The address of the warehouse" })
  address: string;
}
