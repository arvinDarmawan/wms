import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30, { message: "Name must be at most 30 characters" })
  @ApiProperty({ description: "The first name of the customer" })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30, { message: "Name must be at most 30 characters" })
  @ApiProperty({ description: "The last name of the customer" })
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: "The customer's email" })
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber("ID")
  @ApiProperty({ description: "The customer's phone number" })
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "The shipping address of the customer" })
  shippingAddress: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "The billing address of the customer" })
  billingAddress: string;
}
