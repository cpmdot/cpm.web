
import { createSlice } from '@reduxjs/toolkit';
import { fetchTestimonials } from './testimonialThunks';

const initialState = {
    testimonials: [],
    loading: false,
    error: null,
}

const testimonialSlice = createSlice({
    name: 'testimonial',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTestimonials.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTestimonials.fulfilled, (state, action) => {
                state.testimonials = action.payload;
                state.loading = false;
            })
            .addCase(fetchTestimonials.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default testimonialSlice.reducer;