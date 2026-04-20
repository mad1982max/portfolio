/// <reference types="@testing-library/jest-dom" />
import { act, screen } from '@testing-library/react';
import Admin from './Admin';
import { renderWithProviders } from '../../testUtils';
import { uploadFile } from '../../store/uploadSlice';

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Admin', () => {
  it('renders a <main> element', () => {
    renderWithProviders(<Admin />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the control panel heading', () => {
    renderWithProviders(<Admin />);
    expect(screen.getByRole('heading', { name: /control panel/i })).toBeInTheDocument();
  });

  it('renders the ResumeUploader', () => {
    renderWithProviders(<Admin />);
    expect(screen.getByText(/upload resume/i)).toBeInTheDocument();
  });

  it('renders the PhotoUploader', () => {
    renderWithProviders(<Admin />);
    expect(screen.getByText(/upload photo/i)).toBeInTheDocument();
  });

  it('does not render FileInfoDisplay before any upload', () => {
    renderWithProviders(<Admin />);
    expect(screen.queryByText(/file name/i)).not.toBeInTheDocument();
  });
});

describe('Admin FileInfoDisplay wiring', () => {
  it('renders FileInfoDisplay for resume after upload is stored', () => {
    const { store } = renderWithProviders(<Admin />);

    act(() => {
      store.dispatch({
        type: uploadFile.fulfilled.type,
        payload: {
          kind: 'resume',
          meta: {
            name: 'resume.pdf',
            size: 12345,
            type: 'application/pdf',
            uploadedAt: '2024-01-01T00:00:00.000Z',
            previewUrl: 'blob:resume-preview',
          },
        },
      });
    });

    expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    expect(screen.getByTitle(/resume preview/i)).toBeInTheDocument();
  });

  it('renders FileInfoDisplay for photo after upload is stored', () => {
    const { store } = renderWithProviders(<Admin />);

    act(() => {
      store.dispatch({
        type: uploadFile.fulfilled.type,
        payload: {
          kind: 'photo',
          meta: {
            name: 'photo.png',
            size: 67890,
            type: 'image/png',
            uploadedAt: '2024-01-02T00:00:00.000Z',
          },
        },
      });
    });

    expect(screen.getByText('photo.png')).toBeInTheDocument();
  });

  it('renders both FileInfoDisplays when both uploads complete', () => {
    const { store } = renderWithProviders(<Admin />);

    act(() => {
      store.dispatch({
        type: uploadFile.fulfilled.type,
        payload: {
          kind: 'resume',
          meta: {
            name: 'resume.pdf',
            size: 12345,
            type: 'application/pdf',
            uploadedAt: '2024-01-01T00:00:00.000Z',
            previewUrl: 'blob:resume-preview',
          },
        },
      });
      store.dispatch({
        type: uploadFile.fulfilled.type,
        payload: {
          kind: 'photo',
          meta: {
            name: 'photo.png',
            size: 67890,
            type: 'image/png',
            uploadedAt: '2024-01-02T00:00:00.000Z',
          },
        },
      });
    });

    expect(screen.getByText('resume.pdf')).toBeInTheDocument();
    expect(screen.getByText('photo.png')).toBeInTheDocument();
  });

  it('replaces resume metadata when a second resume is uploaded', () => {
    const { store } = renderWithProviders(<Admin />);

    act(() => {
      store.dispatch({
        type: uploadFile.fulfilled.type,
        payload: {
          kind: 'resume',
          meta: {
            name: 'resume.pdf',
            size: 12345,
            type: 'application/pdf',
            uploadedAt: '2024-01-01T00:00:00.000Z',
            previewUrl: 'blob:resume-preview',
          },
        },
      });
      store.dispatch({
        type: uploadFile.fulfilled.type,
        payload: {
          kind: 'resume',
          meta: {
            name: 'resume.pdf',
            size: 12345,
            type: 'application/pdf',
            uploadedAt: '2024-01-01T00:00:00.000Z',
            previewUrl: 'blob:resume-preview',
          },
        },
      });
    });

    expect(screen.getAllByText('resume.pdf')).toHaveLength(1);
  });

  it('does not render FileInfoDisplay section when no upload has occurred', () => {
    renderWithProviders(<Admin />);
    expect(screen.queryByLabelText(/uploaded file details/i)).not.toBeInTheDocument();
  });
});
