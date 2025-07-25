import { createAsyncThunk } from "@reduxjs/toolkit";
import axios  from 'axios';
import { fallbackProjects } from "../../pages/fallbackData";

export const fetchProjects = createAsyncThunk(
    'projects/fetchProjects',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('/api/projects');
            return response.data.projects;
        } catch (err) {
            return thunkAPI.fulfillWithValue(fallbackProjects, { fallbackUsed: true });
        }
    }
)