'use client'
import Link from "next/link";
import Image from "next/image";
import login from '../../assets/login.png';

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function Signup() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await axios.post('/api/auth/signup', formData)
            if (response.data.success) {
                router.push('/login')
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 flex items-center justify-center p-4">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center bg-white rounded-3xl py-12 px-12 shadow-2xl w-full max-w-5xl mx-auto transition-all duration-300 hover:shadow-xl">
                <Image 
                    src={login} 
                    alt="logo" 
                    width={500}
                    height={500}
                    className="w-full md:w-1/2 bg-blue-300 h-auto object-cover rounded-3xl shadow-lg transition-transform duration-300 hover:scale-105"
                />
                <div className="flex flex-col gap-6 w-full md:w-1/2 max-w-md">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
                        Create Account
                    </h1>
                    {error && (
                        <div className="bg-red-100 text-red-600 p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}
                    <input 
                        type="text" 
                        name="username"
                        placeholder="Username" 
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-gray-100"
                    />
                    <input 
                        type="email"
                        name="email" 
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required 
                        className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-gray-100"
                    />
                    <input 
                        type="password"
                        name="password" 
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6} 
                        className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-gray-100"
                    />
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                    <Link href="/login" className="w-full">
                        <button type="button" className="w-full py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold transition-all duration-200 hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2">
                            Already have an account? Log In
                        </button>
                    </Link>
                </div>
            </div>
        </form>
    )
}