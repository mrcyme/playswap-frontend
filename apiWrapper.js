const API_URL = 'https://playswap-server.azurewebsites.net';

let token = '';

const apiWrapper = {
  setToken(newToken) {
    token = newToken;
    console.log(token)
  },
  async createPlaylist(data) {
    const response = await fetch(`${API_URL}/Playlist/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },
  async getPlaylist(playlistId) {
    const response = await fetch(`${API_URL}/Playlist/${playlistId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  },
  async getPlaylists() {
    const response = await fetch(`${API_URL}/Playlist/`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return await response.json();
  },
  async updatePlaylist(playlistId, data) {
    const response = await fetch(`${API_URL}/Playlist/${playlistId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },
  async deletePlaylist(playlistId) {
    const response = await fetch(`${API_URL}/Playlist/${playlistId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  },
  async getInfluences(playlistId) {
    const response = await fetch(`${API_URL}/Playlist/${playlistId}/Influences`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  },
  async createInfluence(playlistId, data) {
    const response = await fetch(`${API_URL}/Playlist/${playlistId}/Influences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  },
  async deleteInfluences(playlistId) {
    const response = await fetch(`${API_URL}/Playlist/${playlistId}/Influences`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  }
};

export default apiWrapper;
