import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fallbackServices } from "../../pages/fallbackData";

export const fetchServices = createAsyncThunk(
    'services/fetchServices',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('/api/services');
            return response.data.services;
        } catch (err) {
            return thunkAPI.fulfillWithValue(fallbackServices, { fallbackUsed: true });
        }
    }
)