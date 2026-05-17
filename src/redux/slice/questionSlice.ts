import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  callFetchQuestion,
  callCreateQuestion,
  callUpdateQuestion,
  callDeleteQuestion,
} from "@/config/api";
import type { IQuestion } from "@/types/backend";

/* =====================
   Thunk
===================== */
export const fetchQuestion = createAsyncThunk(
  "question/fetchQuestion",
  async ({ query }: { query?: string }) => {
    const res = await callFetchQuestion(query);
    return res.data;
  }
);

export const createQuestion = createAsyncThunk(
  "question/createQuestion",
  async (question: Partial<IQuestion>) => {
    const res = await callCreateQuestion(question);
    return res.data;
  }
);

export const updateQuestion = createAsyncThunk(
  "question/updateQuestion",
  async ({ question, id }: { question: Partial<IQuestion>; id: string }) => {
    const res = await callUpdateQuestion(question, id);
    return res.data;
  }
);

export const deleteQuestion = createAsyncThunk(
  "question/deleteQuestion",
  async ({ id }: { id: string }) => {
    const res = await callDeleteQuestion(id);
    return res.data;
  }
);

/* =====================
   State
===================== */
interface IState {
  isFetching: boolean;
  meta: {
    limit: number;
    page: number;
    total: number;
  };
  data: IQuestion[];
}

const initialState: IState = {
  isFetching: false,
  meta: {
    limit: 10,
    page: 1,
    total: 0,
  },
  data: [],
};

/* =====================
   Slice
===================== */
const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestion.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchQuestion.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(fetchQuestion.fulfilled, (state, action) => {
        state.isFetching = false;
        const payload = action.payload;
        if (payload?.success && payload.data) {
          state.data = payload.data;
          if (payload.meta) {
            state.meta = payload.meta;
          }
        } else {
          state.data = [];
          state.meta = initialState.meta;
        }
      })

      .addCase(createQuestion.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.isFetching = false;
        const payload = action.payload;
        if (payload?.success && payload.data) {
          state.data.unshift(payload.data);
        }
      })
      .addCase(createQuestion.rejected, (state) => {
        state.isFetching = false;
      })

      .addCase(updateQuestion.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.isFetching = false;
        const payload = action.payload;
        if (payload?.success && payload.data) {
          const index = state.data.findIndex((q) => q.id === payload.data?.id);
          if (index !== -1) {
            state.data[index] = payload.data;
          }
        }
      })
      .addCase(updateQuestion.rejected, (state) => {
        state.isFetching = false;
      })

      .addCase(deleteQuestion.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.isFetching = false;
        if (action.payload?.success) {
          const deletedId = action.meta.arg.id;
          state.data = state.data.filter((q) => q.id !== deletedId);
        }
      })
      .addCase(deleteQuestion.rejected, (state) => {
        state.isFetching = false;
      });
  },
});

export default questionSlice.reducer;
