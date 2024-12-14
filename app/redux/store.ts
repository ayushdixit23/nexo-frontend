import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../redux/slices/tasksSlice";

const store = configureStore({
  reducer: {
    tasks: tasksReducer, // Add the tasksSlice reducer here
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;