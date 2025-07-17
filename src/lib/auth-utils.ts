import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { setCookie, getCookie, deleteCookie } from 'cookies-next'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export interface AuthToken {
  userId: string
  email: string
  userType: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: AuthToken): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): AuthToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthToken
  } catch {
    return null
  }
}

export function setAuthCookie(res: NextResponse, token: string) {
  setCookie('auth-token', token, {
    req: res as any,
    res: res as any,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })
}

export function getAuthToken(req: NextRequest): string | undefined {
  return getCookie('auth-token', { req: req as any }) as string | undefined
}

export function removeAuthCookie(res: NextResponse) {
  deleteCookie('auth-token', {
    req: res as any,
    res: res as any,
    path: '/'
  })
}