import crypto from 'crypto';
import User from '../models/User.js';
import Institution from '../models/Institution.js';
import { ROLES } from '../config/constants.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokenUtils.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { logActivity } from '../utils/auditLogger.js';
import { sendEmail } from '../services/emailService.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, institutionId, departmentId, phone, rollNumber } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 409, 'A user with this email address already exists.');
    }

    // Role safety: Only SUPER_ADMIN can create another SUPER_ADMIN or COLLEGE_ADMIN directly
    const requestedRole = role || ROLES.STUDENT;
    if (
      (requestedRole === ROLES.SUPER_ADMIN || requestedRole === ROLES.COLLEGE_ADMIN) &&
      (!req.user || req.user.role !== ROLES.SUPER_ADMIN)
    ) {
      return errorResponse(res, 403, 'Privilege escalation prevented. Cannot create administrative accounts.');
    }

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: requestedRole,
      institutionId: requestedRole === ROLES.SUPER_ADMIN ? null : institutionId,
      departmentId,
      phone,
      rollNumber,
      emailVerificationToken,
      emailVerificationExpires,
      isEmailVerified: false,
    });

    // Send verification email
    const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${emailVerificationToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Verify your CampusFlow Account',
      text: `Welcome to CampusFlow! Please verify your email by opening: ${verifyUrl}`,
      html: `<h2>Welcome to CampusFlow</h2><p>Please click below to verify your email:</p><a href="${verifyUrl}">Verify Email</a>`,
    });

    await logActivity({
      userId: user._id,
      institutionId: user.institutionId,
      action: 'USER_REGISTERED',
      entity: 'User',
      entityId: user._id.toString(),
      req,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return successResponse(res, 201, 'Registration successful. Please verify your email.', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institutionId: user.institutionId,
        departmentId: user.departmentId,
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password')
      .populate('institutionId', 'name code logo')
      .populate('departmentId', 'name code');

    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid email or password.');
    }

    if (!user.isActive) {
      return errorResponse(res, 403, 'Your account has been deactivated. Please contact administrator.');
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await logActivity({
      userId: user._id,
      institutionId: user.institutionId?._id || user.institutionId,
      action: 'USER_LOGIN',
      entity: 'User',
      entityId: user._id.toString(),
      req,
    });

    return successResponse(res, 200, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        institutionId: user.institutionId,
        departmentId: user.departmentId,
        profileImage: user.profileImage,
        rollNumber: user.rollNumber,
        cgpa: user.cgpa,
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) {
      return errorResponse(res, 401, 'Refresh token required');
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      return errorResponse(res, 401, 'Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.id).select('+tokenVersion');
    if (!user || !user.isActive) {
      return errorResponse(res, 401, 'Invalid user session');
    }

    if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== user.tokenVersion) {
      return errorResponse(res, 401, 'Session revoked. Please log in again.');
    }

    // Refresh token rotation
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, 200, 'Token refreshed successfully', {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { tokenVersion: 1 } });
      await logActivity({
        userId: req.user._id,
        institutionId: req.user.institutionId,
        action: 'USER_LOGOUT',
        entity: 'User',
        entityId: req.user._id.toString(),
        req,
      });
    }

    res.clearCookie('refreshToken');
    return successResponse(res, 200, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('institutionId', 'name code logo website')
      .populate('departmentId', 'name code');

    return successResponse(res, 200, 'User profile fetched', user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, profileImage, skills, resumeUrl } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (profileImage !== undefined) updates.profileImage = profileImage;
    if (skills !== undefined) updates.skills = skills;
    if (resumeUrl !== undefined) updates.resumeUrl = resumeUrl;

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('institutionId', 'name code')
      .populate('departmentId', 'name code');

    await logActivity({
      userId: req.user._id,
      institutionId: req.user.institutionId,
      action: 'PROFILE_UPDATED',
      entity: 'User',
      entityId: req.user._id.toString(),
      req,
    });

    return successResponse(res, 200, 'Profile updated successfully', updatedUser);
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return 200 to prevent user enumeration
      return successResponse(res, 200, 'If this email exists in our system, a password reset link has been sent.');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request — CampusFlow',
      text: `You requested a password reset. Click this link: ${resetUrl}`,
      html: `<p>You requested a password reset. Click the link below to set a new password:</p><a href="${resetUrl}">Reset Password</a>`,
    });

    return successResponse(res, 200, 'If this email exists in our system, a password reset link has been sent.');
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    }).select('+password');

    if (!user) {
      return errorResponse(res, 400, 'Password reset token is invalid or has expired.');
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    await logActivity({
      userId: user._id,
      institutionId: user.institutionId,
      action: 'PASSWORD_RESET',
      entity: 'User',
      entityId: user._id.toString(),
      req,
    });

    return successResponse(res, 200, 'Password has been reset successfully. You may now log in.');
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) {
      return errorResponse(res, 400, 'Verification token is required.');
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return errorResponse(res, 400, 'Verification token is invalid or has expired.');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return successResponse(res, 200, 'Email successfully verified. You can now use all platform features.');
  } catch (err) {
    next(err);
  }
};
