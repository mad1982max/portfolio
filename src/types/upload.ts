export interface UploadedFileMeta {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  previewUrl?: string;
}

export type UploadState =
  | { status: 'idle' }
  | { status: 'uploading'; progress: number }
  | { status: 'success' }
  | { status: 'error'; message: string };
