import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  callFetchCategory,
  callCreateCategory,
  callUpdateCategory,
  callDeleteCategory,
} from "@/config/api";
import type { ICategory } from "@/types/backend";

/* =====================
   Thunk
===================== */
export const fetchCategory = createAsyncThunk(
  "category/fetchCategory",
  async ({ query }: { query?: string }) => {
    const res = await callFetchCategory(query);
    return res.data;
  }
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (category: Partial<ICategory>) => {
    const res = await callCreateCategory(category);
    return res.data;
  }
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ category, id }: { category: Partial<ICategory>; id: string }) => {
    const res = await callUpdateCategory(category, id);
    return res.data;
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async ({ id }: { id: string }) => {
    const res = await callDeleteCategory(id);
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
  data: ICategory[];
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
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchCategory.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchCategory.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
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

      .addCase(createCategory.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isFetching = false;
        const payload = action.payload;
        if (payload?.success && payload.data) {
          state.data.unshift(payload.data);
        }
      })
      .addCase(createCategory.rejected, (state) => {
        state.isFetching = false;
      })

      .addCase(updateCategory.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isFetching = false;
        const payload = action.payload;
        if (payload?.success && payload.data) {
          const index = state.data.findIndex((c) => c.id === payload.data?.id);
          if (index !== -1) {
            state.data[index] = payload.data;
          }
        }
      })
      .addCase(updateCategory.rejected, (state) => {
        state.isFetching = false;
      })

      .addCase(deleteCategory.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isFetching = false;
        if (action.payload?.success) {
          const deletedId = action.meta.arg.id;
          state.data = state.data.filter((c) => c.id !== deletedId);
        }
      })
      .addCase(deleteCategory.rejected, (state) => {
        state.isFetching = false;
      });
  },
});

export default categorySlice.reducer;
