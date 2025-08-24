import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Modal from '../components/Modal';

describe('Modal', () => {
  const onCloseMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    const root = document.createElement('div');
    root.id = 'root-modal';
    document.body.appendChild(root);
  });

  it('should throw if #root-modal is not found', () => {
    const existing = document.getElementById('root-modal');
    if (existing) document.body.removeChild(existing);

    expect(() =>
      render(
        <Modal isOpen={true} onClose={onCloseMock} title="Modal Title">
          <div>Content</div>
        </Modal>,
      ),
    ).toThrow('#root-modal not found in DOM');
  });

  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={onCloseMock}>
        <div>Content</div>
      </Modal>,
    );

    expect(screen.queryByText('Content')).toBeNull();
  });

  it('should render children and title when open', () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock} title="Modal Title">
        <div>Content</div>
      </Modal>,
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Modal Title')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should call onClose when CloseButton is clicked', () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock}>
        <div>Content</div>
      </Modal>,
    );

    const closeButton = screen.getByLabelText(/close details/i);
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('should call onClose when clicking on overlay background', () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock}>
        <div>Content</div>
      </Modal>,
    );

    const overlay = screen.getByRole('dialog');
    fireEvent.click(overlay);

    expect(onCloseMock).toHaveBeenCalled();
  });

  it('should stop propagation when clicking inside modal content', () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock}>
        <div data-testid="content">Content</div>
      </Modal>,
    );

    const content = screen.getByTestId('content');
    fireEvent.click(content);
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it('should call onClose when pressing Escape key', () => {
    render(
      <Modal isOpen={true} onClose={onCloseMock}>
        <div>Content</div>
      </Modal>,
    );

    const overlay = screen.getByRole('dialog');
    fireEvent.keyDown(overlay, { key: 'Escape', code: 'Escape' });

    expect(onCloseMock).toHaveBeenCalled();
  });
});
