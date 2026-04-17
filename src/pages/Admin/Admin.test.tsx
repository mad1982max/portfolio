/// <reference types="@testing-library/jest-dom" />
import { render, screen, act } from '@testing-library/react';
import Admin from './Admin';
import type { UploadedFileMeta } from '../../types/upload';

// Silence console.log from FileInfoDisplay during tests
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => {
  jest.restoreAllMocks();
});

describe('Admin', () => {
  it('renders a <main> element', () => {
    render(<Admin />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the control panel heading', () => {
    render(<Admin />);
    expect(screen.getByRole('heading', { name: /control panel/i })).toBeInTheDocument();
  });

  it('renders the ResumeUploader', () => {
    render(<Admin />);
    expect(screen.getByText(/upload resume/i)).toBeInTheDocument();
  });

  it('renders the PhotoUploader', () => {
    render(<Admin />);
    expect(screen.getByText(/upload photo/i)).toBeInTheDocument();
  });

  it('does not render FileInfoDisplay before any upload', () => {
    render(<Admin />);
    expect(screen.queryByText(/file name/i)).not.toBeInTheDocument();
  });
});

// Helper to get the onUploadComplete callback from a mocked uploader
// We test Admin's state wiring by mocking the child components
jest.mock('../../components/ResumeUploader/ResumeUploader', () => ({
  __esModule: true,
  default: ({ onUploadComplete }: { onUploadComplete: (meta: UploadedFileMeta) => void }) => (
    <button
      data-testid="resume-trigger"
      onClick={() =>
        onUploadComplete({
          name: 'resume.pdf',
          size: 12345,
          type: 'application/pdf',
          uploadedAt: new Date('2024-01-01T00:00:00Z'),
        })
      }
    >
      Upload Resume
    </button>
  ),
}));

jest.mock('../../components/PhotoUploader/PhotoUploader', () => ({
  __esModule: true,
  default: ({ onUploadComplete }: { onUploadComplete: (meta: UploadedFileMeta) => void }) => (
    <button
      data-testid="photo-trigger"
      onClick={() =>
        onUploadComplete({
          name: 'photo.png',
          size: 67890,
          type: 'image/png',
          uploadedAt: new Date('2024-01-02T00:00:00Z'),
        })
      }
    >
      Upload Photo
    </button>
  ),
}));

describe('Admin – FileInfoDisplay wiring', () => {
  it('renders FileInfoDisplay for resume after onUploadComplete is called', () => {
    render(<Admin />);
    act(() => {
      screen.getByTestId('resume-trigger').click();
    });
    expect(screen.getByText('resume.pdf')).toBeInTheDocument();
  });

  it('renders FileInfoDisplay for photo after onUploadComplete is called', () => {
    render(<Admin />);
    act(() => {
      screen.getByTestId('photo-trigger').click();
    });
    expect(screen.getByText('photo.png')).toBeInTheDocument();
  });

  it('renders both FileInfoDisplays when both uploads complete', () => {
    render(<Admin />);
    act(() => {
      screen.getByTestId('resume-trigger').click();
      screen.getByTestId('photo-trigger').click();
    });
    expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    expect(screen.getByText('photo.png')).toBeInTheDocument();
  });

  it('replaces resume metadata when a second resume is uploaded', () => {
    render(<Admin />);
    act(() => {
      screen.getByTestId('resume-trigger').click();
    });
    expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    // Trigger again (same mock always emits resume.pdf, but state is replaced)
    act(() => {
      screen.getByTestId('resume-trigger').click();
    });
    // Still shows the file (replaced, not duplicated)
    expect(screen.getAllByText('resume.pdf')).toHaveLength(1);
  });

  it('does not render FileInfoDisplay section when no upload has occurred', () => {
    render(<Admin />);
    expect(screen.queryByLabelText(/uploaded file details/i)).not.toBeInTheDocument();
  });
});
