import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/api/projects');
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const createProject = createAsyncThunk('projects/createProject', async (projectData, { rejectWithValue }) => {
    try {
        const response = await api.post('/api/projects', projectData);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const deleteProject = createAsyncThunk('projects/deleteProject', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/api/projects/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const projectSlice = createSlice({
    name: 'projects',
    initialState: {
        projects: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.isLoading = false;
                state.projects = action.payload;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.projects.push(action.payload);
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.projects = state.projects.filter(p => p.id !== action.payload);
            });
    },
});

export default projectSlice.reducer;
