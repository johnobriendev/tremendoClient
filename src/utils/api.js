const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
};

export const resendVerification = async (email) => {
  const response = await fetch(`${API_BASE_URL}/users/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to resend verification email');
  }

  return data;
};


export const resetPassword = async (token, passwordData) => {
  const response = await fetch(`${API_BASE_URL}/users/reset-password?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(passwordData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to reset password');
  }

  return data;
};

export const fetchUserData = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
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
    throw new Error('Failed to fetch boards');
  }
  return response.json();
};

export const fetchAllBoards = async (token) => {
  const response = await fetch(`${API_BASE_URL}/boards/all`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch boards');
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
  if (!response.ok) {
    throw new Error('Failed to create a new board');
  }
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
  if (!response.ok) {
    throw new Error('Failed to update the board');
  }
  return response.json();
};

export const deleteBoard = async (token, boardId) => {
  const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete the board');
  }
};

export const fetchBoardData = async (token, boardId) => {
  const boardResponse = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!boardResponse.ok) {
    throw new Error(`Error fetching board: ${boardResponse.statusText}`);
  }
  return boardResponse.json();
};

export const fetchBoardDetails = async (token, boardId) => {
  const response = await fetch(`${API_BASE_URL}/boards/${boardId}/details`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch board details');
  }

  return response.json();
};

export const inviteUserToBoard = async (token, boardId, email) => {
  const response = await fetch(`${API_BASE_URL}/invitations/boards/${boardId}/invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to invite user');
  }

  return response.json();
};

export const fetchInvitations = async (token) => {
  const response = await fetch(`${API_BASE_URL}/invitations`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch invitations');
  }

  return response.json();
};

export const respondToInvitation = async (token, invitationId, accept) => {
  const response = await fetch(`${API_BASE_URL}/invitations/${invitationId}/respond`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ accept }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to respond to invitation');
  }

  return response.json();
};

export const fetchLists = async (token, boardId) => {
  const response = await fetch(`${API_BASE_URL}/lists/${boardId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Error fetching lists: ${response.statusText}`);
  }
  return response.json();
};

export const fetchCards = async (token, boardId) => {
  const response = await fetch(`${API_BASE_URL}/cards/${boardId}/cards`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Error fetching cards: ${response.statusText}`);
  }
  return response.json();
};

export const createList = async (token, boardId, listData) => {
  const response = await fetch(`${API_BASE_URL}/lists/${boardId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(listData),
  });
  if (!response.ok) {
    throw new Error(`Error creating list: ${response.statusText}`);
  }
  return response.json();
};

export const updateList = async (token, listId, listData) => {
  const response = await fetch(`${API_BASE_URL}/lists/${listId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(listData),
  });
  if (!response.ok) {
    throw new Error(`Error updating list: ${response.statusText}`);
  }
  return response.json();
};

export const deleteList = async (token, listId) => {
  const response = await fetch(`${API_BASE_URL}/lists/${listId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Error deleting list: ${response.statusText}`);
  }
};

export const createCard = async (token, boardId, cardData) => {
  const response = await fetch(`${API_BASE_URL}/cards/${boardId}/cards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cardData),
  });
  if (!response.ok) {
    throw new Error(`Error creating card: ${response.statusText}`);
  }
  return response.json();
};

export const updateCard = async (token, cardId, cardData) => {
  const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(cardData),
  });
  if (!response.ok) {
    throw new Error(`Error updating card: ${response.statusText}`);
  }
  return response.json();
};

export const deleteCard = async (token, cardId) => {
  const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Error deleting card: ${response.statusText}`);
  }
};



