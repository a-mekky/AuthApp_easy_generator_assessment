import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

// Mock responses
const mockUserResponse = {
  id: 'user-id-123',
  email: 'test@example.com',
  name: 'Test User',
};

const mockSignupResponse = {
  user: mockUserResponse,
};

const mockSigninResponse = {
  user: mockUserResponse,
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

const mockTokenResponse = {
  accessToken: 'new-access-token',
  refreshToken: 'new-refresh-token',
};

const mockLogoutResponse = {
  success: true,
  message: 'Logged out successfully',
};

// Mock service
const mockAuthService = {
  signup: jest.fn(),
  signin: jest.fn(),
  refreshToken: jest.fn(),
  logout: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    // Reset mock implementations before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    const signupDto: SignupDto = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'Password123!',
    };

    it('should create a new user', async () => {
      mockAuthService.signup.mockResolvedValue(mockSignupResponse);

      const result = await controller.signup(signupDto);

      expect(authService.signup).toHaveBeenCalledWith(signupDto);
      expect(result).toEqual(mockSignupResponse);
    });
  });

  describe('signin', () => {
    const signinDto: SigninDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    it('should authenticate a user and return tokens', async () => {
      mockAuthService.signin.mockResolvedValue(mockSigninResponse);

      const result = await controller.signin(signinDto);

      expect(authService.signin).toHaveBeenCalledWith(signinDto);
      expect(result).toEqual(mockSigninResponse);
    });
  });

  describe('refreshToken', () => {
    const refreshTokenDto: RefreshTokenDto = {
      refreshToken: 'valid-refresh-token',
    };

    it('should refresh tokens with valid refresh token', async () => {
      mockAuthService.refreshToken.mockResolvedValue(mockTokenResponse);

      const result = await controller.refreshToken(refreshTokenDto);

      expect(authService.refreshToken).toHaveBeenCalledWith(refreshTokenDto);
      expect(result).toEqual(mockTokenResponse);
    });
  });

  describe('logout', () => {
    it('should log out a user successfully', async () => {
      // Mock request object with authenticated user
      const mockRequest = {
        user: {
          userId: 'user-id-123',
        },
      };

      mockAuthService.logout.mockResolvedValue(mockLogoutResponse);

      const result = await controller.logout(mockRequest as any);

      expect(authService.logout).toHaveBeenCalledWith('user-id-123');
      expect(result).toEqual(mockLogoutResponse);
    });
  });
});