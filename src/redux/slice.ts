import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: [],
    token: localStorage.getItem("token"),
    loading: false,
    error: null,
    success: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user
            state.token = action.payload.token
            localStorage.setItem("token", action.payload.token)
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        logout: (state) => {
            state.user = []
            state.token = null
            localStorage.removeItem("token")
        },
        setSuccess: (state, action) => {
            state.success = action.payload
        },
        clearSuccess: (state) => {
            state.error = null
            state.success = null
        }
    }
})

export const { setCredentials, setLoading, setError, logout, setSuccess, clearSuccess } = authSlice.actions
export default authSlice.reducer

