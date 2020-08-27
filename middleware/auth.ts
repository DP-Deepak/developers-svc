import * as express from 'express';
import * as jwt from 'jsonwebtoken'
import { envVariable } from '../config/configuration';

export const middleware = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token')

  // Check if not token
  if (!token) {
    return res
      .status(401)
      .json({ msg: 'No token, authorization denied' })
  }

  try {
    const decoded = jwt.verify(token, envVariable.jwtSecret)

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' })
  }

}