"use client"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setLoading, clearSuccess, setError } from "../../redux/slice"
import type { RootState } from "../../redux/store"
import { useRouter } from "next/navigation"
import Image from "next/image"
import login from "../../assets/login.png"
import Link from "next/link"
import axios from 'axios'

export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [formErrors, setFormErrors] = useState({ email: "", password: "" })

    const dispatch = useDispatch()
    const { loading, error, success } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        return () => {
            dispatch(clearSuccess())
        }
    }, [dispatch])

    const validateForm = () => {
        let isValid = true
        const errors = { email: "", password: "" }

        if (!email) {
            errors.email = "Email is required"
            isValid = false
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Please enter a valid email"
            isValid = false
        }

        if (!password) {
            errors.password = "Password is required"
            isValid = false
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters"
            isValid = false
        }

        setFormErrors(errors)
        return isValid
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateForm()) return

        dispatch(setLoading(true))
        
        try {
            const response = await axios.post('/api/auth/login', {
                email,
                password
            })
            
            if (response.data.success) {
                localStorage.setItem('token', response.data.token)
                router.push('/dashboard')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'An error occurred during login'
            dispatch(setError(errorMessage))
        } finally {
            dispatch(setLoading(false))
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 flex items-center justify-center p-4">
            <div className="flex flex-col-reverse md:flex-row gap-8 items-center justify-center bg-white rounded-3xl py-12 px-12 shadow-2xl w-full max-w-5xl mx-auto transition-all duration-300 hover:shadow-xl">
                <div className="flex flex-col w-full md:w-1/2 max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-gray-600">Please sign in to your account</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 flex items-center space-x-2">
                            <span className="text-sm">{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-100 flex items-center space-x-2">
                            <span className="text-sm">{success}</span>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-gray-100"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {formErrors.email && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full px-4 py-3 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-gray-100"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {formErrors.password && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                            <Link href="/signup" className="w-full block">
                                <button
                                    type="button"
                                    className="w-full py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold transition-all duration-200 hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                                >
                                    Create New Account
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
                <Image 
                    src={login} 
                    alt="logo" 
                    width={500}
                    height={500}
                    className="w-full md:w-1/2 h-auto bg-blue-300 object-cover rounded-3xl shadow-lg transition-transform duration-300 hover:scale-105"
                />
            </div>
        </div>
    )
}