import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { fallbackTestimonials } from "../../pages/fallbackData";

export const fetchTestimonials = createAsyncThunk(
    'testimonials/fetchTestimonials',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('/api/testimonials');
            return response.data.testimonials;
        } catch (err) {
            return thunkAPI.fulfillWithValue(fallbackTestimonials, { fallbackUsed: true });
        }
    }
)