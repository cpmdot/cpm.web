import { createAsyncThunk } from '@reduxjs/toolkit';
import { getSlides } from '../../api/api';
import axios from 'axios';
import { fallbackSlides } from '../../pages/fallbackData';

export const fetchSlideshow = createAsyncThunk(
    'slideshow/fetchSlideshow',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('/api/slideshow');
            return response.data.slides;
        } catch (err) {
            return thunkAPI.fulfillWithValue(fallbackSlides, { fallbackUsed: true });
        }
    });