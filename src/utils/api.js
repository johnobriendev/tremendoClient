const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('token', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

const getRefreshToken = () => localStorage.getItem('refreshToken');

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const { accessToken } = await response.json();
    localStorage.setItem('token', accessToken);
    return accessToken;
  } catch (error) {
    clearTokens();
    throw error;
  }
};


// Helper function for authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      
      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`
        }
      });

      if (!retryResponse.ok) {
        const error = await retryResponse.json();
        throw new Error(error.message || 'Request failed');
      }
      return retryResponse.json();
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    return response.json();
  } catch (error) {
    if (error.message === 'Failed to refresh token') {
      clearTokens();
    }
    throw error;
  }
};

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
  setTokens(data.accessToken, data.refreshToken);
  return data;
};

export const logoutUser = async () => {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    try {
      await fetch(`${API_BASE_URL}/users/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  clearTokens();
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

export const fetchUserData = async () => {
  return makeAuthenticatedRequest(`${API_BASE_URL}/users`);
};

export const fetchBoards = async () => {
  return makeAuthenticatedRequest(`${API_BASE_URL}/boards`);
};

export const fetchAllBoards = async () => {
  return makeAuthenticatedRequest(`${API_BASE_URL}/boards/all`);
};

export const createBoard = async (boardData) => {
  return makeAuthenticatedRequest(`${API_BASE_URL}/boards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(boardData)
  });
};

export const updateBoard = async (boardId, boardData) => {
  return makeAuthenticatedRequest(`${API_BASE_URL}/boards/${boardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(boardData)
  });
};

export const deleteBoard = async (boardId) => {
  return makeAuthenticatedRequest(`${API_BASE_URL}/boards/${boardId}`, {
    method: 'DELETE'
  });
};

export const fetchBoardData = async (boardId) => {
  return makeAuthenticatedRequest(`${API_BASE_URL}/boards/${boardId}`);
};

export const fetchBoardDetails = async (boardId) => {
  return makeAuthenticatedRequest(`${API_BASE_URL}/boards/${boardId}/details`);
};

export const inviteUserToBoard = async (boardId, email) => {
  return makeAuthenticatedRequest(`${API_BASE_URL}/invitations/boards/${boardId}/invite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
};

export const fetchInvitations = async () => {
  return makeAuthenticatedRequest(`${API_BASE_URL}/invitations`);
};

export const respondToInvitation = async (invitationId, accept) => {
  return makeAuthenticatedRequest(`${API_BASE_URL}/invitations/${invitationId}/respond`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accept })
  });
};

export const fetchLists = async (boardId) => {
  return makeAuthenticatedRequest(`${API_BASE_URL}/lists/${boardId}`);
};

export const fetchCards = async (boardId) => {
  return makeAuthenticatedRequest(`${API_BASE_URL}/cards/${boardId}/cards`);
};

export const createList = async (boardId, listData) => {
  return makeAuthenticatedRequest(`${API_BASE_URL}/lists/${boardId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listData)
  });
};

export const updateList = async (listId, listData) => {
  return makeAuthenticatedRequest(`${API_BASE_URL}/lists/${listId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listData)
  });
};

export const deleteList = async (listId) => {
  return makeAuthenticatedRequest(`${API_BASE_URL}/lists/${listId}`, {
    method: 'DELETE'
  });
};

export const createCard = async (boardId, cardData) => {
  return makeAuthenticatedRequest(`${API_BASE_URL}/cards/${boardId}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cardData)
  });
};

export const updateCard = async (cardId, cardData) => {
  return makeAuthenticatedRequest(`${API_BASE_URL}/cards/${cardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cardData)
  });
};

export const deleteCard = async (cardId) => {
  return makeAuthenticatedRequest(`${API_BASE_URL}/cards/${cardId}`, {
    method: 'DELETE'
  });
};







