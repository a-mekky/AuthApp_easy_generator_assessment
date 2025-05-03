import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenService } from '../common/utils/token.utils';
import {
  SignupResponse,
  SigninResponse,
  TokenResponse,
  UserResponse,
  LogoutResponse
} from './types/auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) { }

  /**
   * Register a new user
   * @param signupDto - The user registration data
   * @returns The created user information
   */
  async signup(signupDto: SignupDto): Promise<SignupResponse> {
    try {
      // Create the user
      const user = await this.usersService.create(signupDto);

      return {
        user: this.mapToUserResponse(user),
      };
    } catch (error) {
      // Handle duplicate email error or other registration issues
      throw new BadRequestException(error.message || 'Failed to create user');
    }
  }

  /**
   * Authenticate a user and generate tokens
   * @param signinDto - The user login credentials
   * @returns User information and authentication tokens
   */
  async signin(signinDto: SigninDto): Promise<SigninResponse> {
    const { email, password } = signinDto;

    // Find user by email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password - using a constant-time comparison
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.tokenService.createTokens(user.id);

    // Store refresh token securely
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.mapToUserResponse(user),
      ...tokens,
    };
  }

  /**
   * Refresh access token using a valid refresh token
   * @param refreshTokenDto - The refresh token
   * @returns New access and refresh tokens
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<TokenResponse> {
    const { refreshToken } = refreshTokenDto;

    try {
      // Verify refresh token and extract payload
      const payload = this.tokenService.verifyRefreshToken(refreshToken);
      // Find user
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Validate stored refresh token
      if (!user.refreshToken || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.tokenService.createTokens(user.id);

      // Update stored refresh token
      await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Log out a user by invalidating their refresh token
   * @param userId - The ID of the user to log out
   * @returns Success message
   */
  async logout(userId: string): Promise<LogoutResponse> {
    try {
      // Clear refresh token in database
      await this.usersService.updateRefreshToken(userId, null);
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      throw new BadRequestException('Logout failed');
    }
  }

  /**
   * Map a user document to a response object
   * @param user - User document from database
   * @returns Sanitized user response object
   */
  private mapToUserResponse(user: any): UserResponse {
    return {
      id: user._id || user.id,
      email: user.email,
      name: user.name,
    };
  }
}