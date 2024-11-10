import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DragDropContext } from 'react-beautiful-dnd';
import Card from './Card';

// Mock react-beautiful-dnd
vi.mock('react-beautiful-dnd', () => ({
  Draggable: ({ children }) => children({
    draggableProps: {
      style: {},
    },
    dragHandleProps: {},
    innerRef: () => {},
  }, {
    isDragging: false,
  }),
}));

// Mock react-icons
vi.mock('react-icons/md', () => ({
  MdOutlineModeEdit: () => <div data-testid="edit-icon">Edit</div>,
  MdSave: () => <div data-testid="save-icon">Save</div>,
}));

vi.mock('react-icons/io', () => ({
  IoMdClose: () => <div data-testid="close-icon">Close</div>,
}));

vi.mock('react-icons/fa', () => ({
  FaTrash: () => <div data-testid="trash-icon">Delete</div>,
}));

describe('Card Component', () => {
  const mockCard = {
    _id: '123',
    name: 'Test Card',
    description: 'Test Description',
    comments: [
      { _id: 'comment1', text: 'Test Comment 1' },
      { _id: 'comment2', text: 'Test Comment 2' }
    ]
  };

  const mockProps = {
    card: mockCard,
    index: 0,
    onUpdateCard: vi.fn(),
    onDeleteCard: vi.fn(),
    theme: 'light'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders card with correct initial content', () => {
    render(<Card {...mockProps} />);
    expect(screen.getByText('Test Card')).toBeDefined();
  });

  it('opens edit mode when edit icon is clicked', async () => {
    const user = userEvent.setup();
    render(<Card {...mockProps} />);
    
    const editIcon = screen.getByTestId('edit-icon');
    await user.click(editIcon);
    
    const textarea = screen.getByTestId('card-name-input');
    expect(textarea).toBeDefined();
    expect(textarea.value).toBe('Test Card');
  });

  it('updates card name when edited', async () => {
    const user = userEvent.setup();
    render(<Card {...mockProps} />);
    
    // Open edit mode
    const editIcon = screen.getByTestId('edit-icon');
    await user.click(editIcon);
    
    // Edit the text
    const textarea = screen.getByTestId('card-name-input');
    await user.clear(textarea);
    await user.type(textarea, 'Updated Card Name');
    
    // Blur the textarea to trigger save
    fireEvent.blur(textarea);
    
    expect(mockProps.onUpdateCard).toHaveBeenCalledWith('123', {
      name: 'Updated Card Name'
    });
  });

  it('opens detail modal when card is clicked', async () => {
    const user = userEvent.setup();
    render(<Card {...mockProps} />);
    
    await user.click(screen.getByText('Test Card'));
    
    expect(screen.getByText('Description')).toBeDefined();
    expect(screen.getByText('Comments')).toBeDefined();
  });

  it('shows delete confirmation modal when delete is clicked', async () => {
    const user = userEvent.setup();
    render(<Card {...mockProps} />);
    
    // Open options menu
    const editIcon = screen.getByTestId('edit-icon');
    await user.click(editIcon);
    
    // Click delete button
    const deleteButton = screen.getByText('Delete Card');
    await user.click(deleteButton);
    
    expect(screen.getByText('Are you sure you want to delete this card?')).toBeDefined();
  });

  it('deletes card when confirmation is accepted', async () => {
    const user = userEvent.setup();
    render(<Card {...mockProps} />);
    
    // Open options menu
    const editIcon = screen.getByTestId('edit-icon');
    await user.click(editIcon);
    
    // Click delete button
    const deleteButton = screen.getByText('Delete Card');
    await user.click(deleteButton);
    
    // Confirm deletion
    const confirmButton = screen.getByText('Yes, Delete');
    await user.click(confirmButton);
    
    expect(mockProps.onDeleteCard).toHaveBeenCalledWith('123');
  });

  it('updates description when saved in detail modal', async () => {
    const user = userEvent.setup();
    render(<Card {...mockProps} />);
    
    // Open detail modal
    await user.click(screen.getByText('Test Card'));
    
    // Update description
    const descriptionTextarea = screen.getByPlaceholderText('Add a description...');
    await user.clear(descriptionTextarea);
    await user.type(descriptionTextarea, 'New Description');
    
    // Save description
    const saveButton = screen.getByText('Save Description');
    await user.click(saveButton);
    
    expect(mockProps.onUpdateCard).toHaveBeenCalledWith('123', {
      description: 'New Description'
    });
  });

  it('adds new comment when submitted', async () => {
    // Mock fetch for adding comment
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ...mockCard, comments: [...mockCard.comments, { _id: 'comment3', text: 'New Comment' }] })
      })
    );

    const user = userEvent.setup();
    render(<Card {...mockProps} />);
    
    // Open detail modal
    await user.click(screen.getByText('Test Card'));
    
    // Add new comment
    const commentTextarea = screen.getByPlaceholderText('Write a comment...');
    await user.type(commentTextarea, 'New Comment');
    
    const addButton = screen.getByText('Add Comment');
    await user.click(addButton);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('deletes comment when delete icon is clicked', async () => {
    // Mock fetch for deleting comment
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ...mockCard, comments: [mockCard.comments[1]] })
      })
    );

    const user = userEvent.setup();
    render(<Card {...mockProps} />);
    
    // Open detail modal
    await user.click(screen.getByText('Test Card'));
    
    // Delete first comment
    const deleteIcons = screen.getAllByTestId('trash-icon');
    await user.click(deleteIcons[0]);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('handles theme changes correctly', async () => {
    const { rerender } = render(<Card {...mockProps} theme="dark" />);
    
    // Wait for the card element to render and resolve the promise
    const cardElement = await screen.findByText('Test Card');
    const closestDiv = cardElement.closest('div');
    
    expect(closestDiv).toHaveStyle({ backgroundColor: '#374151' });
  
    // Rerender with light theme and wait for the update
    rerender(<Card {...mockProps} theme="light" />);
    
    // Wait for the style to update
    await waitFor(() => {
      expect(closestDiv).toHaveStyle({ backgroundColor: '#EDF2F7' });
    });
  });
  

  // Test error handling for API calls
  it('handles API errors when adding comments', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Server Error'
      })
    );

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const user = userEvent.setup();
    render(<Card {...mockProps} />);
    
    await user.click(screen.getByText('Test Card'));
    await user.type(screen.getByPlaceholderText('Write a comment...'), 'New Comment');
    await user.click(screen.getByText('Add Comment'));
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    
    consoleSpy.mockRestore();
  });
});