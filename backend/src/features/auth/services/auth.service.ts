import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import type { RegisterInput, LoginInput } from '../../../shared/types/auth.schemas'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string })
const prisma = new PrismaClient({ adapter })
const SALT_ROUNDS = 10

export async function registerUser(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    })

    if (existingUser) {
        throw new Error('Email already in use')
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
        },
    })

    return { id: user.id, name: user.name, email: user.email }
}

export async function loginUser(data: LoginInput) {
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    })

    if (!user) {
        throw new Error('Invalid credentials')
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password)

    if (!passwordMatch) {
        throw new Error('Invalid credentials')
    }

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    )

    return { token, user: { id: user.id, name: user.name, email: user.email } }
} //commit