import type { Request, Response } from 'express'
import { registerSchema, loginSchema } from '../../../shared/types/auth.schemas'
import { registerUser, loginUser } from '../services/auth.service'

export async function register(req: Request, res: Response) {
  const result = registerSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors })
    return
  }

  try {
    const user = await registerUser(result.data)
    res.status(201).json({ user })
  } catch (error: any) {
    res.status(409).json({ message: error.message })
  }
}

export async function login(req: Request, res: Response) {
  const result = loginSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors })
    return
  }

  try {
    const { token, user } = await loginUser(result.data)
    res.status(200).json({ token, user })
  } catch (error: any) {
    res.status(401).json({ message: error.message })
  }
}