import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from './features/projects/slice';
import slideshowReducer from "./features/slides/slice";
import serviceReducer from "./features/services/slice";
import testimonialReducer from './features/testimonials/slice';
import appointmentReducer from './features/appointments/slice';

export const store = configureStore({
    reducer: {
        appointments: appointmentReducer,
        slides: slideshowReducer,
        services: serviceReducer,
        projects: projectsReducer,
        testimonials: testimonialReducer,
    },
});