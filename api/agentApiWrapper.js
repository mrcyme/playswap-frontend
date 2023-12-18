const API_URL = 'http://127.0.0.1:5000'
const agentApiWrapper = {

  async createUser(userData) {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    const user = await response.json();
    return user;
  },

  async loginUser(userData) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    const user = await response.json();
    return user;
  },

  async getAllAgents() {
    const response = await fetch(`${API_URL}/agents`);
    const agents = await response.json();
    return agents;
  },

  async getAgentById(id) {
    const response = await fetch(`${API_URL}/agents/${id}`);
    const agent = await response.json();
    return agent;
  },

  async getAgentsByUser(user_id) {
    const response = await fetch(`${API_URL}/agents/user/${user_id}`);
    return await response.json();
  },

  async createAgent(agentData) {
    console.log(agentData)
    const response = await fetch(`${API_URL}/agents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(agentData)
    });
    const createdAgent = await response.json();
    return createdAgent;
  },

  async runAgent(id) {
    const user_id = localStorage.getItem('user_id') || '';
    const data={
      user_id: user_id
    }
    const response = await fetch(`${API_URL}/agents/${id}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    const runAgent = await response.json();
    return runAgent;
  },

  async updateAgent(id, agentData) {
    console.log(agentData)
    const response = await fetch(`${API_URL}/agents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(agentData)
    });
    const updatedAgent = await response.json();
    return updatedAgent;
  },

  async deleteAgent(id) {
    const user_id = localStorage.getItem('user_id') || '';
    const data={
      user_id: user_id
    }
    const response = await fetch(`${API_URL}/agents/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    const deletedAgent = await response.json();
    return deletedAgent;
  },
}

export default agentApiWrapper;
