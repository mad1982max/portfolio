/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import UploadProgressIndicator from './UploadProgressIndicator';

describe('UploadProgressIndicator', () => {
  it('renders without crashing', () => {
    render(<UploadProgressIndicator progress={0} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays the progress percentage label', () => {
    render(<UploadProgressIndicator progress={42} />);
    expect(screen.getAllByText('42%').length).toBeGreaterThan(0);
  });

  it('sets the progress element value attribute', () => {
    render(<UploadProgressIndicator progress={75} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('value', '75');
  });

  it('renders 0% correctly', () => {
    render(<UploadProgressIndicator progress={0} />);
    expect(screen.getAllByText('0%').length).toBeGreaterThan(0);
  });

  it('renders 100% correctly', () => {
    render(<UploadProgressIndicator progress={100} />);
    expect(screen.getAllByText('100%').length).toBeGreaterThan(0);
  });
});
