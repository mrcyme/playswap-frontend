const API_URL = 'https://playswap-server.azurewebsites.net';
//const API_URL = 'http://localhost:5240';


const playswapApiWrapper = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/Account/login?Email=${email}&Password=${password}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return await response.json();
  },

  async createPlaylist(data) {
    const token = localStorage.getItem('token') || '';
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
    const token = localStorage.getItem('token') || '';
    console.log(token)
    const response = await fetch(`${API_URL}/Playlist/${playlistId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  },


  async getPlaylists() {
    const token = localStorage.getItem('token') || '';
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

  async approvePlaylist(playlistId) {
    const token = localStorage.getItem('token') || '';
    const response = await fetch(`${API_URL}/Playlist/${playlistId}/approve`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  },


  async updatePlaylist(playlistId, data) {
    const token = localStorage.getItem('token') || '';
    const response = await fetch(`${API_URL}/Playlist/${playlistId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    console.log(response)
    return await response.json();
  },

  async deletePlaylist(playlistId) {
    const token = localStorage.getItem('token') || '';
    const response = await fetch(`${API_URL}/Playlist/${playlistId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  },
  async getInfluences(playlistId) {
    const token = localStorage.getItem('token') || '';
    const response = await fetch(`${API_URL}/Playlist/${playlistId}/Influence`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  },
  async createInfluence(playlistId, data) {
    const token = localStorage.getItem('token') || '';
    const response = await fetch(`${API_URL}/Playlist/${playlistId}/Influence`, {
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
    const token = localStorage.getItem('token') || '';
    const response = await fetch(`${API_URL}/Playlist/${playlistId}/Influence`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  },
  async getPriorityTracks(playlistId) {
    const token = localStorage.getItem('token') || '';
    const response = await fetch(`${API_URL}/Playlist/${playlistId}/Track`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  },
  async createPriorityTrack(playlistId, trackId) {
    const token = localStorage.getItem('token') || '';
    const response = await fetch(`${API_URL}/Playlist/${playlistId}/Track?spotifyTrackUri=${trackId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return await response.json();
  },

  
  
};

export default playswapApiWrapper;
