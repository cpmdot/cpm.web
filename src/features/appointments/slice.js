import { createSlice } from "@reduxjs/toolkit";
import { createAppointment } from "./thunks";

const appointmentSlice = createSlice({
    name: 'appointment',
    initialState: {
        appointment: null,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetStatus: (state) => {
            state.appointment = null;
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAppointment.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.appointment = action.payload;
                state.success = true;
            })
            .addCase(createAppointment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default appointmentSlice.reducer;