import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { AuthResponseDto, UserProfileDto } from './dto/auth-response.dto';

const BCRYPT_SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const normalizedEmail = signUpDto.email.toLowerCase().trim();
    const existingUser = await this.usersService.findByEmail(normalizedEmail);

    if (existingUser) {
      this.logger.warn(
        `Registration conflict: email already exists (${normalizedEmail})`,
      );
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(
      signUpDto.password,
      BCRYPT_SALT_ROUNDS,
    );

    const newUser = await this.usersService.create({
      email: normalizedEmail,
      name: signUpDto.name.trim(),
      passwordHash,
    });

    const userProfile: UserProfileDto = {
      id: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt,
    };

    const accessToken = await this.generateAccessToken(
      userProfile.id,
      userProfile.email,
    );

    this.logger.log(`User registered successfully: ${userProfile.email}`);

    return {
      accessToken,
      user: userProfile,
    };
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    const normalizedEmail = signInDto.email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(normalizedEmail);

    if (!user) {
      this.logger.warn(
        `Sign-in failed: user not found (${normalizedEmail})`,
      );
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      this.logger.warn(
        `Sign-in failed: invalid password for (${normalizedEmail})`,
      );
      throw new UnauthorizedException('Invalid email or password');
    }

    const userProfile: UserProfileDto = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };

    const accessToken = await this.generateAccessToken(
      userProfile.id,
      userProfile.email,
    );

    this.logger.log(`User signed in successfully: ${userProfile.email}`);

    return {
      accessToken,
      user: userProfile,
    };
  }

  async getProfile(userId: string): Promise<UserProfileDto> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  private async generateAccessToken(
    userId: string,
    email: string,
  ): Promise<string> {
    return this.jwtService.signAsync({
      sub: userId,
      email,
    });
  }
}

