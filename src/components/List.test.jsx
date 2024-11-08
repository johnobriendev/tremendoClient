import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import List from './List';

// Mock react-beautiful-dnd
vi.mock('react-beautiful-dnd', () => ({
  Draggable: ({ children }) => children({
    draggableProps: {},
    dragHandleProps: {},
    innerRef: () => {},
  }, {}),
  Droppable: ({ children }) => children({
    draggableProps: {},
    dragHandleProps: {},
    innerRef: () => {},
  }, {}),
  DragDropContext: ({ children }) => children,
}));

describe('List Component', () => {
  const mockList = {
    _id: 'list1',
    name: 'Test List',
    position: 1,
    color: '#ffffff'
  };

  const mockCards = [
    { _id: 'card1', listId: 'list1', name: 'Card 1', position: 1 },
    { _id: 'card2', listId: 'list1', name: 'Card 2', position: 2 }
  ];

  const defaultProps = {
    name: 'Test List',
    list: mockList,
    cards: mockCards,
    newCardName: {},
    editListName: { list1: 'Test List' },
    setEditListName: vi.fn((update) => {
      defaultProps.editListName = {
        ...defaultProps.editListName,
        ...(typeof update === 'function' ? update(defaultProps.editListName) : update)
      };
    }),
    setNewCardName: vi.fn(),
    handleCreateCard: vi.fn(),
    handleDeleteList: vi.fn(),
    handleListNameChange: vi.fn(),
    handleUpdateCard: vi.fn(),
    handleDeleteCard: vi.fn(),
    theme: 'dark'
  };

  let user;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
    defaultProps.editListName = { list1: 'Test List' };
  });

  it('handles list name change', async () => {
    const { rerender } = render(<List {...defaultProps} />);
  
    const listNameInput = screen.getByDisplayValue('Test List');
    
    // Clear and type the new value
    await userEvent.clear(listNameInput);
    await userEvent.type(listNameInput, 'Updated List Name');
    
    // Update the editListName prop manually since we're mocking the state
    defaultProps.editListName = { list1: 'Updated List Name' };
    // Rerender with updated props
    rerender(<List {...defaultProps} />);
    
    // Now check the input value
    expect(screen.getByDisplayValue('Updated List Name')).toBeInTheDocument();
    
    // Simulate Enter key press
    await userEvent.keyboard('{Enter}');
  
    // Verify the handler was called with correct arguments
    await waitFor(() => {
      expect(defaultProps.handleListNameChange).toHaveBeenCalledWith(
        'list1',
        'Updated List Name'
      );
    });
  });
  



  it('renders list name and cards correctly', () => {
    render(<List {...defaultProps} />);
    expect(screen.getByDisplayValue('Test List')).toBeInTheDocument();
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
  });

  it('handles adding new card', async () => {
    render(<List {...defaultProps} />);
    
    // Click "Add Card" button to show input
    const addCardButton = screen.getByText('Add Card');
    fireEvent.click(addCardButton);
    
    // Type new card name and press Enter
    const cardInput = screen.getByPlaceholderText('New Card Name');
    fireEvent.change(cardInput, { target: { value: 'New Card' } });
    fireEvent.keyPress(cardInput, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    expect(defaultProps.handleCreateCard).toHaveBeenCalledWith('list1');
  });

  it('handles list deletion', async () => {
    render(<List {...defaultProps} />);
    
    // Open menu
    const menuButton = screen.getByRole('button', { name: '' });
    fireEvent.click(menuButton);
    
    // Click delete button
    const deleteButton = screen.getByText('Delete List');
    fireEvent.click(deleteButton);
    
    // Confirm deletion
    const confirmButton = screen.getByText('Delete');
    fireEvent.click(confirmButton);
    
    expect(defaultProps.handleDeleteList).toHaveBeenCalledWith('list1');
  });

  it('handles list color change', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: () => Promise.resolve({}),
    });
  
    render(<List {...defaultProps} />);
  
    // First, click the menu button (three dots)
    const menuButton = screen.getByRole('button', { name: '' });
    await userEvent.click(menuButton);
  
    // Now we can find and click the "Clear List Color" button
    const colorButton = screen.getByText('Clear List Color');
    await userEvent.click(colorButton);
  
    // Wait for fetch to be called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(global.fetch.mock.calls[0][1]).toMatchObject({
        method: 'PUT',
        body: JSON.stringify({ color: '' })
      });
    });
  
    // Clean up
    global.fetch.mockRestore();
  });

  it('applies correct theme styles', () => {
    const { rerender } = render(<List {...defaultProps} theme="light" />);
  
    // Check light theme styles
    let listElement = screen.getByPlaceholderText('List Name');
    expect(listElement).toHaveStyle('background-color: rgb(255, 255, 255);');
  
    // Rerender with dark theme
    rerender(<List {...defaultProps} theme="dark" />);
  
    // Check dark theme styles
    listElement = screen.getByPlaceholderText('List Name');
    expect(listElement).toHaveClass('bg-[#374151]');
  });

  it('handles card input visibility toggle', async () => {
    render(<List {...defaultProps} />);
    
    // Initially, card input should not be visible
    expect(screen.queryByPlaceholderText('New Card Name')).not.toBeInTheDocument();
    
    // Click "Add Card" button
    const addCardButton = screen.getByText('Add Card');
    fireEvent.click(addCardButton);
    
    // Card input should now be visible
    expect(screen.getByPlaceholderText('New Card Name')).toBeInTheDocument();
  });

  it('closes menu when clicking outside', async () => {
    render(<List {...defaultProps} />);
    
    // Open menu
    const menuButton = screen.getByRole('button', { name: '' });
    fireEvent.click(menuButton);
    
    // Menu should be visible
    expect(screen.getByText('Delete List')).toBeInTheDocument();
    
    // Click outside
    fireEvent.mouseDown(document.body);
    
    // Menu should be hidden
    await waitFor(() => {
      expect(screen.queryByText('Delete List')).not.toBeInTheDocument();
    });
  });
});




// import { describe, it, expect, vi, beforeEach } from 'vitest';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import List from './List';

// // Mock react-beautiful-dnd
// vi.mock('react-beautiful-dnd', () => ({
//   Draggable: ({ children }) => children({
//     draggableProps: {},
//     dragHandleProps: {},
//     innerRef: () => {},
//   }, {}),
//   Droppable: ({ children }) => children({
//     draggableProps: {},
//     dragHandleProps: {},
//     innerRef: () => {},
//   }, {}),
//   DragDropContext: ({ children }) => children,
// }));

// describe('List Component', () => {
//   const mockList = {
//     _id: 'list1',
//     name: 'Test List',
//     position: 1,
//     color: '#ffffff'
//   };

//   const mockCards = [
//     { _id: 'card1', listId: 'list1', name: 'Card 1', position: 1 },
//     { _id: 'card2', listId: 'list1', name: 'Card 2', position: 2 }
//   ];

//   const defaultProps = {
//     name: 'Test List',
//     list: mockList,
//     cards: mockCards,
//     newCardName: {},
//     editListName: { list1: 'Test List' },
//     setEditListName: vi.fn(),
//     setNewCardName: vi.fn(),
//     handleCreateCard: vi.fn(),
//     handleDeleteList: vi.fn(),
//     handleListNameChange: vi.fn(),
//     handleUpdateCard: vi.fn(),
//     handleDeleteCard: vi.fn(),
//     theme: 'dark'
//   };

//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   it('handles list name change', async () => {
//     render(<List {...defaultProps} />);
    
//     const listNameInput = screen.getByDisplayValue('Test List');
    
//     // Simulate input change directly
//     fireEvent.change(listNameInput, { 
//       target: { value: 'Updated List Name' } 
//     });
    
//     // Manually update editListName in defaultProps to simulate state change
//     defaultProps.editListName.list1 = 'Updated List Name';
    
//     // Simulate Enter key press
//     fireEvent.keyPress(listNameInput, { 
//       key: 'Enter', 
//       code: 'Enter', 
//       charCode: 13 
//     });
    
//     // Verify handleListNameChange was called
//     expect(defaultProps.handleListNameChange).toHaveBeenCalledWith(
//       'list1',
//       'Updated List Name'
//     );
//   });

//   it('renders list name and cards correctly', () => {
//     render(<List {...defaultProps} />);
//     expect(screen.getByDisplayValue('Test List')).toBeInTheDocument();
//     expect(screen.getByText('Card 1')).toBeInTheDocument();
//     expect(screen.getByText('Card 2')).toBeInTheDocument();
//   });

//   it('handles adding new card', async () => {
//     render(<List {...defaultProps} />);
    
//     // Click "Add Card" button to show input
//     const addCardButton = screen.getByText('Add Card');
//     fireEvent.click(addCardButton);
    
//     // Type new card name and press Enter
//     const cardInput = screen.getByPlaceholderText('New Card Name');
//     fireEvent.change(cardInput, { target: { value: 'New Card' } });
//     fireEvent.keyPress(cardInput, { key: 'Enter', code: 'Enter', charCode: 13 });
    
//     expect(defaultProps.handleCreateCard).toHaveBeenCalledWith('list1');
//   });

//   it('handles list deletion', async () => {
//     render(<List {...defaultProps} />);
    
//     // Open menu
//     const menuButton = screen.getByRole('button', { name: '' });
//     fireEvent.click(menuButton);
    
//     // Click delete button
//     const deleteButton = screen.getByText('Delete List');
//     fireEvent.click(deleteButton);
    
//     // Confirm deletion
//     const confirmButton = screen.getByText('Delete');
//     fireEvent.click(confirmButton);
    
//     expect(defaultProps.handleDeleteList).toHaveBeenCalledWith('list1');
//   });

//   it('handles list color change', async () => {
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         json: () => Promise.resolve({}),
//       })
//     );
  
//     render(<List {...defaultProps} />);
  
//     // Trigger the color change interaction
//     const colorButton = screen.getByText(/Clear List Color/i);
//     fireEvent.click(colorButton);
  
//     // Wait for `fetch` to be called
//     await waitFor(() => {
//       expect(global.fetch).toHaveBeenCalled();
//     });
  
//     // Clear mocks after test
//     jest.clearAllMocks();
//   });
  


//   it('applies correct theme styles', () => {
//     const { rerender } = render(<List {...defaultProps} theme="light" />);
  
//     // Check light theme styles
//     let listElement = screen.getByPlaceholderText('List Name');
//     expect(listElement).toHaveStyle('background-color: rgb(255, 255, 255);');  // or whatever the light theme bg color is
  
//     // Rerender with dark theme
//     rerender(<List {...defaultProps} theme="dark" />);
  
//     // Check dark theme styles
//     listElement = screen.getByPlaceholderText('List Name');
//     expect(listElement).toHaveClass('bg-[#374151]');
//   });
  



//   it('handles card input visibility toggle', async () => {
//     render(<List {...defaultProps} />);
    
//     // Initially, card input should not be visible
//     expect(screen.queryByPlaceholderText('New Card Name')).not.toBeInTheDocument();
    
//     // Click "Add Card" button
//     const addCardButton = screen.getByText('Add Card');
//     fireEvent.click(addCardButton);
    
//     // Card input should now be visible
//     expect(screen.getByPlaceholderText('New Card Name')).toBeInTheDocument();
//   });

//   it('closes menu when clicking outside', async () => {
//     render(<List {...defaultProps} />);
    
//     // Open menu
//     const menuButton = screen.getByRole('button', { name: '' });
//     fireEvent.click(menuButton);
    
//     // Menu should be visible
//     expect(screen.getByText('Delete List')).toBeInTheDocument();
    
//     // Click outside
//     fireEvent.mouseDown(document.body);
    
//     // Menu should be hidden
//     await waitFor(() => {
//       expect(screen.queryByText('Delete List')).not.toBeInTheDocument();
//     });
//   });
// });