import { UploadedFileMeta } from '../../types/upload';
import { formatBytes } from '../../utils/formatBytes';

interface FileInfoDisplayProps {
  meta: UploadedFileMeta;
}

export default function FileInfoDisplay({ meta }: FileInfoDisplayProps): JSX.Element {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
      <dt className="font-medium text-gray-500 dark:text-gray-400">File name</dt>
      <dd className="text-gray-900 dark:text-gray-100 break-all">{meta.name}</dd>

      <dt className="font-medium text-gray-500 dark:text-gray-400">Size</dt>
      <dd className="text-gray-900 dark:text-gray-100">{formatBytes(meta.size)}</dd>

      <dt className="font-medium text-gray-500 dark:text-gray-400">Type</dt>
      <dd className="text-gray-900 dark:text-gray-100">{meta.type}</dd>

      <dt className="font-medium text-gray-500 dark:text-gray-400">Uploaded at</dt>
      <dd className="text-gray-900 dark:text-gray-100">{meta.uploadedAt.toLocaleString()}</dd>
    </dl>
  );
}
