import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createContact = createAsyncThunk(
    'contact/createContact',
    async (contactData, thunkAPI) => {
        try {
            const response = await axios.post('/api/contact', contactData);
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);