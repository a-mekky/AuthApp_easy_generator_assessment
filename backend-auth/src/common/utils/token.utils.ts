import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface TokenPayload {
  sub: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface TokenConfig {
  accessTokenExpiration: string;
  refreshTokenExpiration: string;
}

@Injectable()
export class TokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly tokenConfig: TokenConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // Get secrets from environment variables with validation
    this.accessTokenSecret = this.getRequiredConfig('ACCESS_TOKEN_SECRET');
    this.refreshTokenSecret = this.getRequiredConfig('REFRESH_TOKEN_SECRET');
    
    // Default token expiration settings
    this.tokenConfig = {
      accessTokenExpiration: this.configService.get('ACCESS_TOKEN_EXPIRATION', '1d'),
      refreshTokenExpiration: this.configService.get('REFRESH_TOKEN_EXPIRATION', '7d'),
    };
  }

  /**
   * Creates both access and refresh tokens for a user
   * @param userId - The user ID to include in the token
   * @returns Object containing both tokens
   */
  async createTokens(userId: string): Promise<TokenResponse> {
    const payload: TokenPayload = { sub: userId };
    
    const accessToken = this.createAccessToken(payload);
    const refreshToken = this.createRefreshToken(payload);
    
    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Validates a refresh token and returns the payload if valid
   * @param token - The refresh token to validate
   * @returns The decoded token payload
   * @throws UnauthorizedException if token is invalid
   */
  verifyRefreshToken(token: string): TokenPayload {
    try {
      return this.jwtService.verify(token, {
        secret: this.refreshTokenSecret,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Creates an access token
   * @param payload - The payload to include in the token
   * @returns The signed access token
   */
  private createAccessToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.accessTokenSecret,
      expiresIn: this.tokenConfig.accessTokenExpiration,
    });
  }

  /**
   * Creates a refresh token
   * @param payload - The payload to include in the token
   * @returns The signed refresh token
   */
  private createRefreshToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: this.tokenConfig.refreshTokenExpiration,
    });
  }

  /**
   * Gets a required configuration value or throws an error
   * @param key - The configuration key
   * @returns The configuration value
   * @throws Error if the configuration value is missing
   */
  private getRequiredConfig(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(`Missing required configuration: ${key}`);
    }
    return value;
  }
}