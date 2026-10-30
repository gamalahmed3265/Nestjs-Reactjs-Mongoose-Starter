import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { AuthResponseDto, UserProfileDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiCreatedResponse({
    description: 'User registered successfully and JWT issued',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validation failed for input fields' })
  @ApiConflictResponse({ description: 'Email address is already registered' })
  async signUp(@Body() signUpDto: SignUpDto): Promise<AuthResponseDto> {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate an existing user and receive a JWT' })
  @ApiOkResponse({
    description: 'User authenticated successfully',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validation failed for input fields' })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  async signIn(@Body() signInDto: SignInDto): Promise<AuthResponseDto> {
    return this.authService.signIn(signInDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user profile (/auth/me)' })
  @ApiOkResponse({
    description: 'Authenticated user profile details',
    type: UserProfileDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  async getMe(@CurrentUser() user: UserProfileDto): Promise<UserProfileDto> {
    return user;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user profile (/auth/profile)' })
  @ApiOkResponse({
    description: 'Authenticated user profile details',
    type: UserProfileDto,
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  async getProfile(
    @CurrentUser() user: UserProfileDto,
  ): Promise<UserProfileDto> {
    return user;
  }
}

