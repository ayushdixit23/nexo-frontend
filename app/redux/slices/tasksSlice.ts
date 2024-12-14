// src/features/tasksSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Types
export interface Task {
  id: string;
  text: string;
  createdAt: Date;
  temporary?: boolean;
  creator: {
    id: string;
    fullname: string;
    profilepic: string;
    email: string;
  };
  status: string;
  assignedTeams?: [];
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
  sortOrder: "old" | "new"; // New state for sorting order
}

// Initial state
const initialState: TasksState = {
  mytasks: [],
  teams: [],
  loading: false,
  error: null,
  sortOrder: "new",
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
    setSortOrder: (state, action: PayloadAction<"old" | "new">) => {
      state.sortOrder = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      // Add new task to the list
      state.mytasks.push(action.payload);

      // Sort tasks based on the current sortOrder
      state.mytasks = state.mytasks.slice().sort((a, b) => {
        if (state.sortOrder === "new") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
      });
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.mytasks.findIndex((task) => task.temporary === true);

      if (index !== -1) {
        // Replace the temporary task with the updated one and remove `temporary`
        state.mytasks[index] = { ...action.payload, temporary: false }; // Remove temporary flag
      }
    },
    addTeamTask: (state, action: PayloadAction<Task>) => {
      const task = action.payload;

      // Iterate over the selected teams and add the task to each team's tasks
      (task.assignedTeams || []).forEach((teamId) => {
        const team = state.teams.find((t) => t.id === teamId);
        if (team) {
          team.tasks.push(task);
        }
      });

      // Optionally, if you want to add the task to mytasks as well
      state.mytasks.push(task);
    },
    updateTeamTask: (state, action: PayloadAction<Task>) => {
      const updatedTask = action.payload;


      // Update each team’s tasks array
      state.teams.forEach((team) => {
        const teamTaskIndex = team.tasks.findIndex((task) => task.temporary === true);
        if (teamTaskIndex !== -1) {
          team.tasks[teamTaskIndex] = updatedTask;
        }
      });

      // Optionally, sort again
      // state.mytasks = state.mytasks.slice().sort((a, b) => {
      //   if (state.sortOrder === "new") {
      //     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      //   } else {
      //     return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      //   }
      // });
    },
  },
});

export const selectSortedTasks = (state: RootState) => {
  console.log(state?.tasks.mytasks, "state");
  if (!state?.tasks.mytasks || !Array.isArray(state?.tasks.mytasks)) {
    return []; // Return an empty array if mytasks is undefined or not an array
  }

  return state?.tasks.mytasks.slice().sort((a, b) => {
    if (state?.tasks.sortOrder === "new") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });
};

export const {
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFailure,
  setSortOrder,
  addTask,
  updateTask,
  updateTeamTask,
  addTeamTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;
