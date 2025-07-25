
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createAppointment = createAsyncThunk(
    'appointment/createAppointment',
    async (appointmentData, thunkAPI) => {
        try {
            const response = await axios.post('/api/appointments', appointmentData);
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const getAppointmentAvailableSlots = createAsyncThunk(
    'appointment/getAppointmentAvailableSlots',
    async (date, thunkAPI) => {
        try {
            const response = await axios.get(`/api/appointments/available-slots`, {
                params: { date }
            });
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);