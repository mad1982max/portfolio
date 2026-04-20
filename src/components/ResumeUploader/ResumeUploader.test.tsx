/// <reference types="@testing-library/jest-dom" />
import { screen, fireEvent, waitFor } from '@testing-library/react';
import ResumeUploader from './ResumeUploader';
import { simulateUpload } from '../../utils/uploadSimulation';
import { renderWithProviders } from '../../testUtils';

jest.mock('../../utils/uploadSimulation', () => ({
  simulateUpload: jest.fn(() => Promise.resolve()),
}));

const mockedSimulateUpload = simulateUpload as jest.MockedFunction<typeof simulateUpload>;

beforeAll(() => {
  Object.defineProperty(URL, 'createObjectURL', {
    writable: true,
    value: jest.fn(() => 'blob:resume-preview'),
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    writable: true,
    value: jest.fn(),
  });
});

function makeFile(name: string, type: string, size = 1024) {
  return new File(['x'.repeat(size)], name, { type });
}

describe('ResumeUploader', () => {
  beforeEach(() => {
    mockedSimulateUpload.mockResolvedValue(undefined);
  });

  it('renders without crashing and shows the file input', () => {
    renderWithProviders(<ResumeUploader />);
    expect(screen.getByLabelText(/resume file/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
  });

  it('does not show progress indicator initially', () => {
    renderWithProviders(<ResumeUploader />);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('shows validation error for invalid MIME type', async () => {
    renderWithProviders(<ResumeUploader />);
    const input = screen.getByLabelText(/resume file/i);
    const file = makeFile('test.exe', 'application/x-msdownload');

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/accepted formats/i);
    });
  });

  it('shows validation error for oversized file', async () => {
    renderWithProviders(<ResumeUploader />);
    const input = screen.getByLabelText(/resume file/i);
    const file = makeFile('big.pdf', 'application/pdf', 6 * 1024 * 1024);

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/5 mb/i);
    });
  });

  it('stores metadata after successful upload', async () => {
    const { store } = renderWithProviders(<ResumeUploader />);
    const input = screen.getByLabelText(/resume file/i);
    const file = makeFile('resume.pdf', 'application/pdf', 1024);

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(store.getState().uploads.resume.meta).toEqual(
        expect.objectContaining({
          name: 'resume.pdf',
          type: 'application/pdf',
          previewUrl: 'blob:resume-preview',
        })
      );
    });
  });

  it('shows retry button on upload error', async () => {
    mockedSimulateUpload.mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<ResumeUploader />);
    const input = screen.getByLabelText(/resume file/i);
    const file = makeFile('resume.pdf', 'application/pdf', 1024);

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });
});
