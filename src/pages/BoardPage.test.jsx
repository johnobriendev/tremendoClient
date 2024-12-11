import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BoardPage from './BoardPage';
import userEvent from '@testing-library/user-event';

// Mock the List component
vi.mock('./List', () => ({
  default: ({ list, cards, theme }) => (
    <div data-testid={`list-${list._id}`}>
      <h3>{list.name}</h3>
      <div>
        {cards
          .filter(card => card.listId === list._id)
          .map(card => (
            <div key={card._id} data-testid={`card-${card._id}`}>
              {card.name}
            </div>
          ))}
      </div>
    </div>
  ),
}));

// Mock data
const mockBoard = {
  _id: 'board1',
  name: 'Test Board'
};

const mockLists = [
  { _id: 'list1', name: 'List 1', position: 1 },
  { _id: 'list2', name: 'List 2', position: 2 }
];

const mockCards = [
  { _id: 'card1', name: 'Card 1', listId: 'list1', position: 1 },
  { _id: 'card2', name: 'Card 2', listId: 'list1', position: 2 },
  { _id: 'card3', name: 'Card 3', listId: 'list2', position: 1 }
];

describe('BoardPage Component', () => {
  beforeEach(() => {
    // Mock environment variable
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000');
    
    // Setup localStorage mock
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn()
    };
    global.localStorage = localStorageMock;
    
    // Setup default localStorage values
    localStorage.getItem.mockImplementation((key) => {
      const values = {
        'theme': 'light',
        'backgroundImage': "url('/bsas1.webp')",
        'token': 'mock-token'
      };
      return values[key];
    });

    // Mock fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the board page and fetches initial data', async () => {
    // Mock API responses
    global.fetch
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockBoard)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockLists)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCards)
      }));

    render(
      <MemoryRouter initialEntries={['/boards/board1']}>
        <Routes>
          <Route path="/boards/:boardId" element={<BoardPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the board name to appear
    await waitFor(() => {
      expect(screen.getByText('Test Board')).toBeInTheDocument();
    });

    // Verify API calls were made
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('allows adding a new list', async () => {
    global.fetch
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockBoard)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockLists)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCards)
      }));

    render(
      <MemoryRouter initialEntries={['/boards/board1']}>
        <Routes>
          <Route path="/boards/:boardId" element={<BoardPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the add list button to appear
    await waitFor(() => {
      expect(screen.getByText(/add another list/i)).toBeInTheDocument();
    });

    // Click add list button
    fireEvent.click(screen.getByText(/add another list/i));

    // Type new list name
    const input = screen.getByPlaceholderText(/enter list title/i);
    fireEvent.change(input, { target: { value: 'New List' } });

    // Mock the create list API call
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ _id: 'list3', name: 'New List', position: 3 })
    }));

    // Click add list button
    fireEvent.click(screen.getByText('Add List'));

    // Verify API call
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/lists/board1'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('New List')
        })
      );
    });
  });
});