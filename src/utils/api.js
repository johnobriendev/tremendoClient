const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchUserData = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    if (response.status === 401) throw new Error('unauthorized');
    throw new Error('Failed to fetch user data');
  }
  return response.json();
};

export const fetchBoards = async (token) => {
  const response = await fetch(`${API_BASE_URL}/boards`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    if (response.status === 401) throw new Error('unauthorized');
    throw new Error('Failed to fetch boards');
  }
  return response.json();
};

export const createBoard = async (token, boardData) => {
  const response = await fetch(`${API_BASE_URL}/boards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(boardData),
  });
  if (!response.ok) throw new Error('Failed to create board');
  return response.json();
};

export const updateBoard = async (token, boardId, boardData) => {
  const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(boardData),
  });
  if (!response.ok) throw new Error('Failed to update board');
  return response.json();
};

export const deleteBoard = async (token, boardId) => {
  const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to delete board');
};