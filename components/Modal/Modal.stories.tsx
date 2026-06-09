import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within, expect } from '@storybook/test';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Modal>;

export default meta;

function ModalDemo({
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscape = true,
}: {
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open {size} modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Example dialog"
        size={size}
        closeOnBackdropClick={closeOnBackdropClick}
        closeOnEscape={closeOnEscape}
      >
        <p>
          This is the modal body. It can contain any content — forms, confirmations, or rich media.
        </p>
        <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </div>
      </Modal>
    </>
  );
}

export const Default: StoryFn<typeof Modal> = () => <ModalDemo />;

export const Small: StoryFn<typeof Modal> = () => <ModalDemo size="sm" />;
Small.storyName = 'Size: Small';

export const Large: StoryFn<typeof Modal> = () => <ModalDemo size="lg" />;
Large.storyName = 'Size: Large';

export const Fullscreen: StoryFn<typeof Modal> = () => <ModalDemo size="fullscreen" />;
Fullscreen.storyName = 'Size: Fullscreen';

export const NoBackdropClose: StoryFn<typeof Modal> = () => (
  <ModalDemo closeOnBackdropClick={false} />
);
NoBackdropClose.storyName = 'Backdrop click disabled';

export const KeyboardInteraction: StoryFn<typeof Modal> = () => <ModalDemo />;
KeyboardInteraction.storyName = 'Keyboard: Escape closes modal';
KeyboardInteraction.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const trigger = canvas.getByRole('button', { name: /open md modal/i });

  await userEvent.click(trigger);
  const dialog = within(document.body).getByRole('dialog');
  await expect(dialog).toBeInTheDocument();

  await userEvent.keyboard('{Escape}');
  await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
};
