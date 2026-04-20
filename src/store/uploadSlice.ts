import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { simulateUpload } from '../utils/uploadSimulation';
import type { UploadedFileMeta, UploadState } from '../types/upload';

export type UploadKind = 'photo' | 'resume';

interface UploadEntryState {
  meta: UploadedFileMeta | null;
  uploadState: UploadState;
}

export interface UploadSliceState {
  photo: UploadEntryState;
  resume: UploadEntryState;
}

const createInitialEntryState = (): UploadEntryState => ({
  meta: null,
  uploadState: { status: 'idle' },
});

const initialState: UploadSliceState = {
  photo: createInitialEntryState(),
  resume: createInitialEntryState(),
};

interface UploadFileArgs {
  kind: UploadKind;
  file: File;
}

interface UploadFileResult {
  kind: UploadKind;
  meta: UploadedFileMeta;
}

export const uploadFile = createAsyncThunk<UploadFileResult, UploadFileArgs>(
  'uploads/uploadFile',
  async ({ kind, file }, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as { uploads: UploadSliceState };
    const previousPreviewUrl = state.uploads[kind].meta?.previewUrl;

    if (previousPreviewUrl) {
      URL.revokeObjectURL(previousPreviewUrl);
    }

    const previewUrl = URL.createObjectURL(file);

    try {
      await simulateUpload((progress) => {
        dispatch(setUploadProgress({ kind, progress }));
      });

      return {
        kind,
        meta: {
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
          previewUrl,
        },
      };
    } catch (error) {
      URL.revokeObjectURL(previewUrl);

      const message = error instanceof Error ? error.message : 'Upload failed. Please try again.';

      return rejectWithValue({ kind, message });
    }
  }
);

const uploadsSlice = createSlice({
  name: 'uploads',
  initialState,
  reducers: {
    resetUploadState(state, action: PayloadAction<UploadKind>) {
      state[action.payload].uploadState = { status: 'idle' };
    },
    setUploadProgress(state, action: PayloadAction<{ kind: UploadKind; progress: number }>) {
      state[action.payload.kind].uploadState = {
        status: 'uploading',
        progress: action.payload.progress,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state, action) => {
        state[action.meta.arg.kind].uploadState = { status: 'uploading', progress: 0 };
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state[action.payload.kind].meta = action.payload.meta;
        state[action.payload.kind].uploadState = { status: 'success' };
      })
      .addCase(uploadFile.rejected, (state, action) => {
        const fallbackKind = action.meta.arg.kind;
        const payload = action.payload as { kind: UploadKind; message: string } | undefined;
        const kind = payload?.kind ?? fallbackKind;
        const message = payload?.message ?? 'Upload failed. Please try again.';

        state[kind].uploadState = { status: 'error', message };
      });
  },
});

export const { resetUploadState, setUploadProgress } = uploadsSlice.actions;
export default uploadsSlice.reducer;
