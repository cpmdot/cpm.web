import { createSlice } from '@reduxjs/toolkit';   
import { fetchSlideshow } from './slideThunks';

const initialState = {
  slides: [],
  loading: false,
  error: null,
};

const slideshowSlice = createSlice({
  name: 'slideshow',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSlideshow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSlideshow.fulfilled, (state, action) => {
        state.slides = action.payload;
        state.loading = false;
      })
      .addCase(fetchSlideshow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default slideshowSlice.reducer;