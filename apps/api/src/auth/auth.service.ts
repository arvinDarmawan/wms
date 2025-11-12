import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { UserService } from "src/user/user.service";
import { UserEntity } from "src/user/user.entity";
import { AccessToken } from "./types/access-token";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException("User not found");
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException("Password does not match");
    }
    return user;
  }

  async login(user: UserEntity): Promise<AccessToken> {
    const payload = { email: user.email, userId: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
