import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '../../../../database/db'
import User from '../../../../models/User'

export async function POST(req: Request) {
    try {
        const { username, email, password } = await req.json()

        // Connect to database
        await connectDB()

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        })

        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists with this email or username' },
                { status: 400 }
            )
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create new user
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        })

        return NextResponse.json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    } catch (error) {
        console.error('Signup error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
} 