// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService } from './auth.service';
// import { UsersService } from '../users/users.service';
// import { JwtService } from '@nestjs/jwt';

// describe('AuthService', () => {
//   let service: AuthService;

//   // 1. Mock UsersService
//   const mockUsersService = {
//     findByEmail: jest
//       .fn()
//       .mockResolvedValue({ id: '123', password: 'hashed-password' }),
//     // add other stub methods as needed…
//   };

//   // 2. Mock JwtService
//   const mockJwtService = {
//     sign: jest.fn().mockReturnValue('signed-jwt-token'),
//     verify: jest.fn().mockReturnValue({ sub: '123', iat: 0, exp: 0 }),
//     // add other stub methods as needed…
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         { provide: UsersService, useValue: mockUsersService },
//         { provide: JwtService, useValue: mockJwtService },
//       ],
//     }).compile();

//     service = module.get<AuthService>(AuthService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });


import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { TokenService } from '../common/utils/token.utils';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

// Mock data
const mockUser = {
  id: 'user-id-123',
  _id: 'user-id-123',
  email: 'test@example.com',
  name: 'Test User',
  comparePassword: jest.fn(),
  refreshToken: 'old-refresh-token',
};

const mockTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

// Mock services
const mockUsersService = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  updateRefreshToken: jest.fn(),
};

const mockTokenService = {
  createTokens: jest.fn(),
  verifyRefreshToken: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    tokenService = module.get<TokenService>(TokenService);

    // Reset mock implementations before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    const signupDto: SignupDto = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'Password123!',
    };

    it('should create a new user and return user data', async () => {
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await service.signup(signupDto);

      expect(mockUsersService.create).toHaveBeenCalledWith(signupDto);
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
      });
    });

    it('should throw BadRequestException if user creation fails', async () => {
      const errorMessage = 'Email already exists';
      mockUsersService.create.mockRejectedValue(new Error(errorMessage));

      await expect(service.signup(signupDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockUsersService.create).toHaveBeenCalledWith(signupDto);
    });
  });

  describe('signin', () => {
    const signinDto: SigninDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    it('should authenticate user and return tokens and user data', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(true),
      });
      mockTokenService.createTokens.mockResolvedValue(mockTokens);

      const result = await service.signin(signinDto);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(signinDto.email);
      expect(mockTokenService.createTokens).toHaveBeenCalledWith(mockUser.id);
      expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(
        mockUser.id,
        mockTokens.refreshToken,
      );
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        },
        ...mockTokens,
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.signin(signinDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(signinDto.email);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(false),
      });

      await expect(service.signin(signinDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(signinDto.email);
    });
  });

  describe('refreshToken', () => {
    const refreshTokenDto: RefreshTokenDto = {
      refreshToken: 'valid-refresh-token',
    };

    it('should refresh tokens with valid refresh token', async () => {
      mockTokenService.verifyRefreshToken.mockReturnValue({ sub: mockUser.id });
      mockUsersService.findById.mockResolvedValue({
        ...mockUser,
        refreshToken: refreshTokenDto.refreshToken,
      });
      mockTokenService.createTokens.mockResolvedValue(mockTokens);

      const result = await service.refreshToken(refreshTokenDto);

      expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(
        refreshTokenDto.refreshToken,
      );
      expect(mockUsersService.findById).toHaveBeenCalledWith(mockUser.id);
      expect(mockTokenService.createTokens).toHaveBeenCalledWith(mockUser.id);
      expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(
        mockUser.id,
        mockTokens.refreshToken,
      );
      expect(result).toEqual(mockTokens);
    });

    it('should throw UnauthorizedException if refresh token verification fails', async () => {
      mockTokenService.verifyRefreshToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken(refreshTokenDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockTokenService.verifyRefreshToken).toHaveBeenCalledWith(
        refreshTokenDto.refreshToken,
      );
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockTokenService.verifyRefreshToken.mockReturnValue({ sub: mockUser.id });
      mockUsersService.findById.mockResolvedValue(null);

      await expect(service.refreshToken(refreshTokenDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUsersService.findById).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw UnauthorizedException if stored refresh token does not match', async () => {
      mockTokenService.verifyRefreshToken.mockReturnValue({ sub: mockUser.id });
      mockUsersService.findById.mockResolvedValue({
        ...mockUser,
        refreshToken: 'different-refresh-token',
      });

      await expect(service.refreshToken(refreshTokenDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    const userId = 'user-id-123';

    it('should successfully log out a user', async () => {
      mockUsersService.updateRefreshToken.mockResolvedValue(undefined);

      const result = await service.logout(userId);

      expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(
        userId,
        null,
      );
      expect(result).toEqual({
        success: true,
        message: 'Logged out successfully',
      });
    });

    it('should throw BadRequestException if logout fails', async () => {
      mockUsersService.updateRefreshToken.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.logout(userId)).rejects.toThrow(BadRequestException);
      expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(
        userId,
        null,
      );
    });
  });
});