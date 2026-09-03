import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
    institutionId: user.institutionId,
    departmentId: user.departmentId,
    email: user.email,
    name: user.name,
  };

  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET || 'fallback_access_secret', {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });
};

export const generateRefreshToken = (user) => {
  const payload = {
    id: user._id,
    tokenVersion: user.tokenVersion || 0,
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret', {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'fallback_access_secret');
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret');
};
