import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import RefreshTokenModel from '../models/tokens';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-token-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret';

export interface TokenPayload {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const generateTokens = async (payload: TokenPayload): Promise<TokenResponse> => {
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: '15m'
  });

  const refreshToken = jwt.sign({ sub: payload.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: '30d',
  });
  
  const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;
  const expiryDate = new Date((decoded.exp ?? 0) * 1000);
  
  await RefreshTokenModel.create({
    userId: new Types.ObjectId(payload.id),
    token: refreshToken,
    expiresAt: expiryDate,
    isRevoked: false,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = async (token: string): Promise<{ valid: boolean; userId?: string }> => {
  try {
    // Find the token in the database
    const refreshTokenDoc = await RefreshTokenModel.findOne({
      token,
      isRevoked: false,
      expiresAt: { $gt: new Date() }
    });

    if (!refreshTokenDoc) {
      return { valid: false };
    }

    return { 
      valid: true,
      userId: refreshTokenDoc.userId.toString()
    };
  } catch (error) {
    return { valid: false };
  }
};

export const revokeRefreshToken = async (token: string): Promise<boolean> => {
  try {
    await RefreshTokenModel.updateOne(
      { token },
      { isRevoked: true }
    );
    return true;
  } catch (error) {
    return false;
  }
};

export const revokeAllUserRefreshTokens = async (userId: string): Promise<boolean> => {
  try {
    await RefreshTokenModel.updateMany(
      { userId: new Types.ObjectId(userId) },
      { isRevoked: true }
    );
    return true;
  } catch (error) {
    return false;
  }
};