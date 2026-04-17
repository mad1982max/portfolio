import { useState } from 'react';
import ResumeUploader from '../../components/ResumeUploader/ResumeUploader';
import PhotoUploader from '../../components/PhotoUploader/PhotoUploader';
import FileInfoDisplay from '../../components/FileInfoDisplay/FileInfoDisplay';
import type { UploadedFileMeta } from '../../types/upload';

export default function Admin() {
  const [resumeMeta, setResumeMeta] = useState<UploadedFileMeta | null>(null);
  const [photoMeta, setPhotoMeta] = useState<UploadedFileMeta | null>(null);

  return (
    <main className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Control Panel</h1>

      <section className="flex flex-col gap-10">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <ResumeUploader onUploadComplete={setResumeMeta} />
          </div>
          {resumeMeta && (
            <div className="flex-1">
              <h2 className="mb-2 text-base font-semibold">Resume Details</h2>
              <FileInfoDisplay meta={resumeMeta} />
            </div>
          )}
        </div>

        <div className="flex items-start gap-6">
          <div className="flex-1">
            <PhotoUploader onUploadComplete={setPhotoMeta} />
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
