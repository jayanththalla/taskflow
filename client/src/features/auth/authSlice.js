import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

// Thunk for Login
export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post('/api/auth/login', userData);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        isLoading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('user');
            state.user = null;
            api.post('/api/auth/logout'); // Fire and forget
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Login failed';
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
