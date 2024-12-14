// src/features/tasksSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Types
export interface Task {
  id: string;
  text: string;
  createdAt: Date;
  creator: {
    id: string;
    fullname: string;
    profilepic: string;
    email: string;
  };
  status: string;
  assignedTeams?: { id: string; name: string }[];
}

export interface Team {
  id: string;
  name: string;
  members: {
    id: string;
    fullname: string;
    profilepic: string;
    email: string;
  }[];
  tasks: Task[]; // Each team will have tasks
}


interface TasksState {
  mytasks: Task[];
  teams: Team[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: TasksState = {
  mytasks: [],
  teams: [],
  loading: false,
  error: null,
};

// Slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    fetchTasksStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTasksSuccess: (
      state,
      action: PayloadAction<{ mytasks: Task[]; teams: Team[] }>
    ) => {
      state.loading = false;
      state.mytasks = action.payload.mytasks;
      state.teams = action.payload.teams;
    },
    fetchTasksFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchTasksStart, fetchTasksSuccess, fetchTasksFailure } = tasksSlice.actions;

export default tasksSlice.reducer;
