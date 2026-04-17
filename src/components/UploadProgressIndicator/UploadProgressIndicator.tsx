interface UploadProgressIndicatorProps {
  progress: number; // 0–100
}

export default function UploadProgressIndicator({
  progress,
}: UploadProgressIndicatorProps): JSX.Element {
  return (
    <div className="flex flex-col gap-1 w-40">
      <progress
        value={progress}
        max={100}
        className="w-full h-2 rounded overflow-hidden"
        aria-label="Upload progress"
      >
        {progress}%
      </progress>
      <span className="text-sm text-gray-600 dark:text-gray-400">{progress}%</span>
    </div>
  );
}
