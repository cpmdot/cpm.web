
import { createSlice } from '@reduxjs/toolkit';
import { fetchServices } from './serviceThunks';

const initialState = {
    services: [],
    loading: false,
    error: null

}

const serviceSlice = createSlice({
    name: 'service',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchServices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default serviceSlice.reducer;