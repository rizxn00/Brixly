import { Request, Response } from "express";
import crypto from 'crypto';
import bcrypt from "bcrypt";
import UserModel from "../models/users";
import {
  generateTokens,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens
} from "../services/tokenService";
import { generateVerificationToken, setTokenCookies, clearTokenCookies } from "../utils/tokenHelpers"
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { username, email, firstname, lastname, password, isAdmin } = req.body;

  if (!username || !email || !firstname || !lastname || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "Missing required fields" });
  }

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ status: "error", message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const hashedToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    const User = await UserModel.create({
      username,
      email: email.toLowerCase(),
      firstname,
      lastname,
      password: hashedPassword,
      isAdmin: isAdmin !== undefined ? isAdmin : false,
      isVerified: false,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: verificationTokenExpiry,
    });

    return res.status(201).json({ status: "success", message: "Registration successful!" });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "Missing required fields" });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Incorrect email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: "error", message: "Incorrect email or password" });
    }

    // Generate tokens
    const tokens = await generateTokens({
      id: user.id.toString(),
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
    });

    // Set cookies
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    return res.status(200).json({
      status: "success",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

export const googleLogin = async (req: Request, res: Response): Promise<Response> => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({
      status: "error",
      message: "Google credential is required"
    });
  }

  try {
    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({
        status: "error",
        message: "Invalid Google token"
      });
    }

    const { email, given_name, family_name, sub: googleId, name } = payload;

    // Check if user exists
    let user = await UserModel.findOne({
      $or: [
        { email, provider: 'google' },
        { googleId }
      ]
    });

    if (!user) {
      // Create new user
      user = await UserModel.create({
        username: name || `${given_name}_${family_name}`,
        email,
        firstname: given_name || 'Default',
        lastname: family_name || 'User',
        password: '',
        googleId,
        provider: 'google',
        isEmailVerified: true,
        isAdmin: false,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.provider = 'google';
      user.isVerified = true;
      await user.save();
    }

    // Generate tokens
    const tokens = await generateTokens({
      id: user.id.toString(),
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
    });

    // Set cookies
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    return res.status(200).json({
      status: "success",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        isAdmin: user.isAdmin,
        provider: user.provider,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Google authentication failed"
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Get the refresh token from cookies
    const refreshToken = req.cookies.refresh_token;

    // If token exists, revoke it
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    // Clear cookies
    clearTokenCookies(res);

    return res.status(200).json({
      status: "success",
      message: "Logged out successfully"
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({
        status: "error",
        message: "Refresh token not found"
      });
    }

    // Verify the refresh token
    const verification = await verifyRefreshToken(refreshToken);

    if (!verification.valid || !verification.userId) {
      clearTokenCookies(res);
      return res.status(401).json({
        status: "error",
        message: "Invalid or expired refresh token"
      });
    }

    // Get the user
    const user = await UserModel.findById(verification.userId);

    if (!user) {
      clearTokenCookies(res);
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    await revokeRefreshToken(refreshToken);

    // Generate new tokens
    const tokens = await generateTokens({
      id: user.id.toString(),
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
    });

    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    return res.status(200).json({
      status: "success",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        isAdmin: user.isAdmin,
      }
    });
  } catch (error) {
    clearTokenCookies(res);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { currentPassword, newPassword } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return res
        .status(401)
        .json({ status: "error", message: "Incorrect current password" });
    }

    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "New password cannot be the same as the current password",
        });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.updateOne({ _id: req.user.id }, { password: hashedPassword });

    // For security, revoke all refresh tokens for this user
    await revokeAllUserRefreshTokens(req.user.id);

    // Clear cookies and force re-login after password change
    clearTokenCookies(res);

    return res
      .status(200)
      .json({ status: "success", message: "Password updated successfully. Please login again." });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    const user = await UserModel.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    return res.status(200).json({
      status: "success",
      user: {
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        isAdmin: user.isAdmin,
      }
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};