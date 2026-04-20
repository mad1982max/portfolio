import ResumeUploader from '../../components/ResumeUploader/ResumeUploader';
import PhotoUploader from '../../components/PhotoUploader/PhotoUploader';
import FileInfoDisplay from '../../components/FileInfoDisplay/FileInfoDisplay';
import type { UploadedFileMeta } from '../../types/upload';
import { useAppSelector } from '../../store/hooks';

function canPreviewResume(meta: UploadedFileMeta) {
  return meta.type === 'application/pdf' || meta.type === 'text/plain';
}

export default function Admin() {
  const resumeMeta = useAppSelector((state) => state.uploads.resume.meta);
  const photoMeta = useAppSelector((state) => state.uploads.photo.meta);

  return (
    <main className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Control Panel</h1>

      <section className="flex flex-col gap-10">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <ResumeUploader />
          </div>
          {resumeMeta && (
            <div className="flex-1">
              <h2 className="mb-2 text-base font-semibold">Resume Details</h2>
              <FileInfoDisplay meta={resumeMeta} />
              {resumeMeta.previewUrl && (
                <div className="mt-4">
                  <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Resume Preview
                  </h3>
                  {canPreviewResume(resumeMeta) ? (
                    <iframe
                      title="Resume preview"
                      src={resumeMeta.previewUrl}
                      className="h-96 w-full rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700"
                    />
                  ) : (
                    <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-600 dark:text-gray-300">
                      <p>Preview is not available for this file type in the browser.</p>
                      <a
                        href={resumeMeta.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex rounded bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700"
                      >
                        Open resume
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-start gap-6">
          <div className="flex-1">
            <PhotoUploader />
          </div>
          {photoMeta && (
            <div className="flex-1">
              <h2 className="mb-2 text-base font-semibold">Photo Details</h2>
              <FileInfoDisplay meta={photoMeta} />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
