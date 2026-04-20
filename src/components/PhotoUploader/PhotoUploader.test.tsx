/// <reference types="@testing-library/jest-dom" />
import { screen, fireEvent, waitFor } from '@testing-library/react';
import PhotoUploader from './PhotoUploader';
import { simulateUpload } from '../../utils/uploadSimulation';
import { renderWithProviders } from '../../testUtils';

jest.mock('../../utils/uploadSimulation', () => ({
  simulateUpload: jest.fn(() => Promise.resolve()),
}));

const mockedSimulateUpload = simulateUpload as jest.MockedFunction<typeof simulateUpload>;

beforeAll(() => {
  Object.defineProperty(URL, 'createObjectURL', {
    writable: true,
    value: jest.fn(() => 'blob:mock-url'),
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    writable: true,
    value: jest.fn(),
  });
});

function makeFile(name: string, type: string, size = 1024) {
  return new File(['x'.repeat(size)], name, { type });
}

describe('PhotoUploader', () => {
  beforeEach(() => {
    mockedSimulateUpload.mockResolvedValue(undefined);
  });

  it('renders without crashing and shows the file input', () => {
    renderWithProviders(<PhotoUploader />);
    expect(screen.getByLabelText(/photo file/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
  });

  it('does not show progress indicator initially', () => {
    renderWithProviders(<PhotoUploader />);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('does not show preview initially', () => {
    renderWithProviders(<PhotoUploader />);
    expect(screen.queryByAltText(/profile preview/i)).not.toBeInTheDocument();
  });

  it('shows validation error for invalid MIME type', async () => {
    renderWithProviders(<PhotoUploader />);
    const input = screen.getByLabelText(/photo file/i);
    const file = makeFile('doc.pdf', 'application/pdf');

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/accepted formats/i);
    });
  });

  it('shows validation error for oversized file', async () => {
    renderWithProviders(<PhotoUploader />);
    const input = screen.getByLabelText(/photo file/i);
    const file = makeFile('big.jpg', 'image/jpeg', 3 * 1024 * 1024);

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/2 mb/i);
    });
  });

  it('stores photo metadata and shows preview after successful upload', async () => {
    const { store } = renderWithProviders(<PhotoUploader />);
    const input = screen.getByLabelText(/photo file/i);
    const file = makeFile('photo.jpg', 'image/jpeg', 1024);

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(store.getState().uploads.photo.meta).toEqual(
        expect.objectContaining({
          name: 'photo.jpg',
          type: 'image/jpeg',
          previewUrl: 'blob:mock-url',
        })
      );
    });

    expect(screen.getByAltText(/profile preview/i)).toBeInTheDocument();
  });

  it('shows retry button on upload error', async () => {
    mockedSimulateUpload.mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<PhotoUploader />);
    const input = screen.getByLabelText(/photo file/i);
    const file = makeFile('photo.jpg', 'image/jpeg', 1024);

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /upload/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });
});
