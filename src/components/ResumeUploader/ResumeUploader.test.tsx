/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResumeUploader from './ResumeUploader';
import { simulateUpload } from '../../utils/uploadSimulation';

jest.mock('../../utils/uploadSimulation', () => ({
  simulateUpload: jest.fn(() => Promise.resolve()),
}));

const mockedSimulateUpload = simulateUpload as jest.MockedFunction<typeof simulateUpload>;
const mockOnUploadComplete = jest.fn();

function makeFile(name: string, type: string, size = 1024) {
  return new File(['x'.repeat(size)], name, { type });
}

describe('ResumeUploader', () => {
  beforeEach(() => {
    mockOnUploadComplete.mockClear();
    mockedSimulateUpload.mockResolvedValue(undefined);
  });

  it('renders without crashing and shows the file input', () => {
    render(<ResumeUploader onUploadComplete={mockOnUploadComplete} />);
    expect(screen.getByLabelText(/resume file/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
  });

  it('does not show progress indicator initially', () => {
    render(<ResumeUploader onUploadComplete={mockOnUploadComplete} />);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('shows validation error for invalid MIME type', async () => {
    render(<ResumeUploader onUploadComplete={mockOnUploadComplete} />);
    const input = screen.getByLabelText(/resume file/i);
    const file = makeFile('test.exe', 'application/x-msdownload');

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/accepted formats/i);
    });
  });

  it('shows validation error for oversized file', async () => {
    render(<ResumeUploader onUploadComplete={mockOnUploadComplete} />);
    const input = screen.getByLabelText(/resume file/i);
    const file = makeFile('big.pdf', 'application/pdf', 6 * 1024 * 1024);

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/5 mb/i);
    });
  });

  it('calls onUploadComplete with metadata after successful upload', async () => {
    render(<ResumeUploader onUploadComplete={mockOnUploadComplete} />);
    const input = screen.getByLabelText(/resume file/i);
    const file = makeFile('resume.pdf', 'application/pdf', 1024);

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(mockOnUploadComplete).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'resume.pdf', type: 'application/pdf' })
      );
    });
  });

  it('shows retry button on upload error', async () => {
    mockedSimulateUpload.mockRejectedValueOnce(new Error('Network error'));

    render(<ResumeUploader onUploadComplete={mockOnUploadComplete} />);
    const input = screen.getByLabelText(/resume file/i);
    const file = makeFile('resume.pdf', 'application/pdf', 1024);

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });
});
