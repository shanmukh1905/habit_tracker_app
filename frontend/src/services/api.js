const API_BASE_URL = 'http://localhost:5000/api';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
};

export const api = {
  getHabits: async () => {
    const response = await fetch(`${API_BASE_URL}/habits`);
    const data = await handleResponse(response);
    return data.data;
  },

  addHabit: async (name) => {
    const response = await fetch(`${API_BASE_URL}/habits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  deleteHabit: async (id) => {
    const response = await fetch(`${API_BASE_URL}/habits/${id}`, {
      method: 'DELETE',
    });
    await handleResponse(response);
  },

  toggleHabit: async (id) => {
    const response = await fetch(`${API_BASE_URL}/habits/${id}/toggle`, {
      method: 'POST',
    });
    const data = await handleResponse(response);
    return data.data;
  },
}; 