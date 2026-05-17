import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  callFetchPost,
  callCreatePost,
  callUpdatePost,
  callDeletePost,
} from "@/config/api";
import type { IPost } from "@/types/backend";

/* =====================
   Thunk
===================== */
export const fetchPost = createAsyncThunk(
  "post/fetchPost",
  async ({ query }: { query?: string }) => {
    const res = await callFetchPost(query);
    return res.data;
  }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (post: Partial<IPost>) => {
    const res = await callCreatePost(post);
    return res.data;
  }
);

export const updatePost = createAsyncThunk(
  "post/updatePost",
  async ({ post, id }: { post: Partial<IPost>; id: string }) => {
    const res = await callUpdatePost(post, id);
    return res.data;
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async ({ id }: { id: string }) => {
    const res = await callDeletePost(id);
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
  data: IPost[];
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
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchPost.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(fetchPost.rejected, (state) => {
        state.isFetching = false;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
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

      .addCase(createPost.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isFetching = false;
        const payload = action.payload;
        if (payload?.success && payload.data) {
          state.data.unshift(payload.data);
        }
      })
      .addCase(createPost.rejected, (state) => {
        state.isFetching = false;
      })

      .addCase(updatePost.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isFetching = false;
        const payload = action.payload;
        if (payload?.success && payload.data) {
          const index = state.data.findIndex((p) => p.id === payload.data?.id);
          if (index !== -1) {
            state.data[index] = payload.data;
          }
        }
      })
      .addCase(updatePost.rejected, (state) => {
        state.isFetching = false;
      })

      .addCase(deletePost.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isFetching = false;
        if (action.payload?.success) {
          const deletedId = action.meta.arg.id;
          state.data = state.data.filter((p) => p.id !== deletedId);
        }
      })
      .addCase(deletePost.rejected, (state) => {
        state.isFetching = false;
      });
  },
});

export default postSlice.reducer;
