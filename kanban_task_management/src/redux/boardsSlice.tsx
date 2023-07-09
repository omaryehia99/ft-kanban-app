import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import data from "../data/data.json";

interface Board {
  name: string;
  isActive: boolean;
  columns: Column[];
}

interface Column {
  tasks: Task[];
}

interface Task {
  title: string;
  status: string;
  description: string;
  subtasks: Subtask[];
}

interface Subtask {
  isCompleted: boolean;
}

const boardsSlice = createSlice({
  name: "boards",
  initialState: data.boards as Board[],
  reducers: {
    addBoard: (state, action: PayloadAction<Board>) => {
      const isActive = state.length > 0 ? false : true;
      const payload = action.payload;
      const board: Board = {
        name: payload.name,
        isActive,
        columns: [],
      };
      board.columns = payload.columns;
      state.push(board);
    },
    editBoard: (state, action: PayloadAction<Board>) => {
      const payload = action.payload;
      const board = state.find((board) => board.isActive);
      board.name = payload.name;
      board.columns = payload.columns;
    },
    deleteBoard: (state) => {
      const board = state.find((board) => board.isActive);
      state.splice(state.indexOf(board), 1);
    },
    setBoardActive: (state, action: PayloadAction<{ index: number }>) => {
      state.map((board, index) => {
        index === action.payload.index
          ? (board.isActive = true)
          : (board.isActive = false);
        return board;
      });
    },
    addTask: (
      state,
      action: PayloadAction<{
        title: string;
        status: string;
        description: string;
        subtasks: Subtask[];
        newColIndex: number;
      }>
    ) => {
      const {
        title,
        status,
        description,
        subtasks,
        newColIndex
      } = action.payload;
      const task: Task = { title, description, subtasks, status };
      const board = state.find((board) => board.isActive);
      const column = board!.columns.find((col, index) => index === newColIndex);
      column!.tasks.push(task);
    },
    editTask: (
      state,
      action: PayloadAction<{
        title: string;
        status: string;
        description: string;
        subtasks: Subtask[];
        prevColIndex: number;
        newColIndex: number;
        taskIndex: number;
      }>
    ) => {
      const {
        title,
        status,
        description,
        subtasks,
        prevColIndex,
        newColIndex,
        taskIndex
      } = action.payload;
      const board = state.find((board) => board.isActive);
      const column = board!.columns.find((col, index) => index === prevColIndex);
      const task = column!.tasks.find((task, index) => index === taskIndex);
      task!.title = title;
      task!.status = status;
      task!.description = description;
      task!.subtasks = subtasks;
      if (prevColIndex === newColIndex) return;
      column!.tasks = column!.tasks.filter((task, index) => index !== taskIndex);
      const newCol = board!.columns.find((col, index) => index === newColIndex);
      newCol!.tasks.push(task!);
    },
    dragTask: (
      state,
      action: PayloadAction<{
        colIndex: number;
        prevColIndex: number;
        taskIndex: number;
      }>
    ) => {
      const { colIndex, prevColIndex, taskIndex } = action.payload;
      const board = state.find((board) => board.isActive);
      const prevCol = board!.columns.find((col, i) => i === prevColIndex);
      const task = prevCol!.tasks.splice(taskIndex, 1)[0];
      board!.columns.find((col, i) => i === colIndex)!.tasks.push(task);
    },
    setSubtaskCompleted: (
      state,
      action: PayloadAction<{
        colIndex: number;
        taskIndex: number;
        index: number;
      }>
    ) => {
      const { colIndex, taskIndex, index } = action.payload;
      const board = state.find((board) => board.isActive);
      const col = board!.columns.find((col, i) => i === colIndex);
      const task = col!.tasks.find((task, i) => i === taskIndex);
      const subtask = task!.subtasks.find((subtask, i) => i === index);
      subtask!.isCompleted = !subtask!.isCompleted;
    },
    setTaskStatus: (
      state,
      action: PayloadAction<{
        colIndex: number;
        newColIndex: number;
        taskIndex: number;
        status: string;
      }>
    ) => {
      const { colIndex, newColIndex, taskIndex, status } = action.payload;
      const board = state.find((board) => board.isActive);
      const columns = board!.columns;
      const col = columns!.find((col, i) => i === colIndex);
      if (colIndex === newColIndex) return;
      const task = col!.tasks.find((task, i) => i === taskIndex);
      task!.status = status;
      col!.tasks = col!.tasks.filter((task, i) => i !== taskIndex);
      const newCol = columns!.find((col, i) => i === newColIndex);
      newCol!.tasks.push(task!);
    },
    deleteTask: (
      state,
      action: PayloadAction<{
        colIndex: number;
        taskIndex: number;
      }>
    ) => {
      const { colIndex, taskIndex } = action.payload;
      const board = state.find((board) => board.isActive);
      const col = board!.columns.find((col, i) => i === colIndex);
      col!.tasks = col!.tasks.filter((task, i) => i !== taskIndex);
    },
  },
});

export default boardsSlice