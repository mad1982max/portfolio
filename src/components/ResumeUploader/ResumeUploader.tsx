import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { resumeSchema, ACCEPTED_RESUME_TYPES } from '../../schemas/uploadSchemas';
import UploadProgressIndicator from '../UploadProgressIndicator/UploadProgressIndicator';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { resetUploadState, uploadFile } from '../../store/uploadSlice';

type ResumeFormValues = z.infer<typeof resumeSchema>;

export default function ResumeUploader() {
  const dispatch = useAppDispatch();
  const uploadState = useAppSelector((state) => state.uploads.resume.uploadState);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
  });

  const onSubmit = async (data: ResumeFormValues) => {
    await dispatch(uploadFile({ kind: 'resume', file: data.file }));
  };

  const handleRetry = () => {
    reset();
    dispatch(resetUploadState('resume'));
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Upload Resume</h2>

      {uploadState.status === 'error' && (
        <div
          role="alert"
          className="flex items-center justify-between rounded bg-red-100 px-4 py-3 text-red-800 dark:bg-red-900 dark:text-red-200"
        >
          <span>{uploadState.message}</span>
          <button
            type="button"
            onClick={handleRetry}
            className="ml-4 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
        <div className="flex flex-col gap-1">
          <label htmlFor="resume-file" className="text-sm font-medium">
            Resume file
          </label>
          <Controller
            name="file"
            control={control}
            render={({ field: { onChange, ref } }) => (
              <input
                id="resume-file"
                type="file"
                accept={ACCEPTED_RESUME_TYPES.join(',')}
                disabled={uploadState.status === 'uploading'}
                ref={ref}
                onChange={(e) => onChange(e.target.files?.[0] ?? undefined)}
                className="block w-full text-sm text-gray-700 file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-sm file:font-medium hover:file:bg-blue-100 dark:text-gray-300"
              />
            )}
          />
          {errors.file && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {errors.file.message}
            </p>
          )}
        </div>

        {uploadState.status === 'uploading' && (
          <UploadProgressIndicator progress={uploadState.progress} />
        )}

        <button
          type="submit"
          disabled={uploadState.status === 'uploading'}
          className="self-start rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {uploadState.status === 'uploading' ? 'Uploading…' : 'Upload'}
        </button>
      </form>
    </div>
  );
}
