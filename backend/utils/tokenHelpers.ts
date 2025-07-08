import crypto from 'crypto';
import { Response } from "express";

export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const setTokenCookies = (res: Response, accessToken: string, refreshToken: string) => {

  const cookieDomain = process.env.COOKIE_DOMAIN;

  res.cookie('auth_access_token', accessToken, {
    maxAge: 15 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? cookieDomain : ''
  });

  res.cookie('refresh_token', refreshToken, {
    maxAge: 28 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? cookieDomain : ''
  });
};

export const clearTokenCookies = (res: Response) => {

  const cookieDomain = process.env.COOKIE_DOMAIN;

  res.cookie('auth_access_token', '', {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? cookieDomain : ''
  });

  res.cookie('refresh_token', '', {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? cookieDomain : ''
  });

};
