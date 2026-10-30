import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<Partial<UsersService>>;
  let jwtService: jest.Mocked<Partial<JwtService>>;

  const mockUserId = new Types.ObjectId('65f1a2b3c4d5e6f7a8b9c0d1');
  const mockCreatedAt = new Date('2026-10-30T12:00:00.000Z');

  const mockUserDocument = {
    _id: mockUserId,
    email: 'jane.doe@example.com',
    name: 'Jane Doe',
    passwordHash: '$2b$12$hashedPasswordValue',
    createdAt: mockCreatedAt,
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('mock-jwt-access-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    const signUpDto = {
      email: 'Jane.Doe@example.com',
      name: 'Jane Doe',
      password: 'Password1!',
    };

    it('should successfully register a new user, hash the password, and return an access token', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$12$hashedPasswordValue');
      (usersService.create as jest.Mock).mockResolvedValue(mockUserDocument);

      const result = await authService.signUp(signUpDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        'jane.doe@example.com',
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('Password1!', 12);
      expect(usersService.create).toHaveBeenCalledWith({
        email: 'jane.doe@example.com',
        name: 'Jane Doe',
        passwordHash: '$2b$12$hashedPasswordValue',
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUserId.toString(),
        email: 'jane.doe@example.com',
      });
      expect(result).toEqual({
        accessToken: 'mock-jwt-access-token',
        user: {
          id: mockUserId.toString(),
          email: 'jane.doe@example.com',
          name: 'Jane Doe',
          createdAt: mockCreatedAt,
        },
      });
    });

    it('should throw ConflictException (409) when email already exists', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(
        mockUserDocument,
      );

      await expect(authService.signUp(signUpDto)).rejects.toThrow(
        ConflictException,
      );
      expect(usersService.create).not.toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    const signInDto = {
      email: 'jane.doe@example.com',
      password: 'Password1!',
    };

    it('should authenticate valid credentials and return an access token', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(
        mockUserDocument,
      );
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.signIn(signInDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        'jane.doe@example.com',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'Password1!',
        mockUserDocument.passwordHash,
      );
      expect(result).toEqual({
        accessToken: 'mock-jwt-access-token',
        user: {
          id: mockUserId.toString(),
          email: 'jane.doe@example.com',
          name: 'Jane Doe',
          createdAt: mockCreatedAt,
        },
      });
    });

    it('should throw UnauthorizedException (401) if user email does not exist', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException (401) if password does not match', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(
        mockUserDocument,
      );
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});

