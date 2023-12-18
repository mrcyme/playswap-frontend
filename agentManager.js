import agentApiWrapper from './api/agentApiWrapper.js';

window.onload = function() {
    showTab('create');
}
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    
    document.getElementById(tabId).style.display = 'block';
}

async function displayAgents() {
    try {
        const user_id = localStorage.getItem('user_id') || '';
        const agents = await agentApiWrapper.getAgentsByUser(user_id);
        const container = document.getElementById('dashboard');
        container.innerHTML = ''; // Clear existing content

        agents.forEach(agent => {
            const agentDiv = createAgentDiv(agent);
            container.appendChild(agentDiv);
        });
    } catch (error) {
        console.error('Error fetching agents:', error);
        document.getElementById('dashboard').innerText = 'Failed to load agents';
    }
}
async function DeleteAgent(agentId) {
    try {
        await agentApiWrapper.deleteAgent(agentId);
        await displayAgents();  // Refresh the agent display
    } catch (error) {
        console.error('Error deleting agent:', error);
        alert('Failed to delete agent');
    }
}
async function runAgent(agentId) {
    try {
        await agentApiWrapper.runAgent(agentId);
    } catch (error) {
        console.error('Error running agent:', error);
        alert('Failed to run agent');
    }
}

async function editAgentDetails(agentId, data) {
    try {
        await agentApiWrapper.updateAgent(agentId, data);
        await displayAgents();  // Refresh the agent display
    } catch (error) {
        console.error('Error updating agent:', error);
        alert('Failed to update agent');
    }
}

function createAgentDiv(agent) {
    const div = document.createElement('div');
    div.className = 'agent';
    console.log(agent)
    div.innerHTML = `
        <h3>${agent.id}</h3>
        <p>Agent type: ${agent.type}</p>
        <p>Associated url: ${agent.url} days</p>
        <p>Language: ${agent.language}</p>`;
    const deleteButton = createButton('Delete', () => DeleteAgent(agent.id));
    const runButton = createButton('Run', () => runAgent(agent.id));
    const {editDetailsButton, editDetailsDiv } = createEditDetailsElements(agent.id);
    div.appendChild(editDetailsButton); 
    div.appendChild(runButton);
    div.appendChild(deleteButton);
    div.appendChild(editDetailsDiv);
    return div;
}


// Function to create the "Edit Details" button and div
function createEditDetailsElements(agentId) {
    const editDetailsButton = createButton('Edit Details', toggleEditDetailsDiv, agentId);
    const editDetailsDiv = document.createElement('div');
    editDetailsDiv.id = `edit-details-for-${agentId}`;
    editDetailsDiv.className = 'edit-details';
    editDetailsDiv.style.display = 'none';
    // Create input for the new title
    const runEachInput = document.createElement('input');
    runEachInput.type = 'number';
    runEachInput.min = 1;
    runEachInput.step = 1;
    runEachInput.placeholder = 'New runEach';
    runEachInput.className = 'edit-runEach-input';
    const user_id = localStorage.getItem('user_id') || '';
    const data = {
        user_id: user_id,
        run_each: runEachInput.value
    }
    // Create a button to submit the new details
    const submitButton = createButton('Update Details', () => editAgentDetails(agentId, data));
    submitButton.className = 'submit-edit-details-button';

    // Append the inputs and submit button to the div
    editDetailsDiv.appendChild(runEachInput);
    editDetailsDiv.appendChild(submitButton);
    return { editDetailsButton, editDetailsDiv };
}

function createButton(text, eventListener, agentId) {
    const button = document.createElement('button');
    button.innerText = text;
    button.setAttribute('data-agent-id', agentId);
    button.addEventListener('click', eventListener);
    return button;
}

// Add this function to agentApiWrapper.js if not already present
async function deleteAgent(agentId) {
    try {
        await agentApiWrapper.deleteAgent(agentId);
        await displayAgents();  // Refresh the agent list
    } catch (error) {
        console.error('Error deleting agent:', error);
        alert('Failed to delete agent');
    }
}

// Placeholder for validateAgent function
async function validateAgent(agentId) {
    // Implement validation logic here
    console.log('Validating agent', agentId);
}

// Placeholder for updateAgentDetails function
function updateAgentDetails(agentId) {
    // Implement agent update logic here
    console.log('Updating agent details for', agentId);
}


// Function to toggle the edit details div visibility
function toggleEditDetailsDiv(event) {
    const agentId = event.target.getAttribute('data-agent-id');
    hideOtherSections(agentId, 'edit-details');
    const editDetailsDiv = document.getElementById(`edit-details-for-${agentId}`);
    editDetailsDiv.style.display = editDetailsDiv.style.display === 'none' ? 'block' : 'none';
}



// Make sure to update the hideOtherSections function to include 'edit-details'
function hideOtherSections(agentId, sectionToShow) {
    const sections = ['edit-details'];
    sections.forEach(section => {
        if (section !== sectionToShow) {
            const div = document.getElementById(`${section}-for-${playlistId}`);
            if (div) {
                div.style.display = 'none';
            }
        }
    });
}



document.addEventListener('DOMContentLoaded', () => {
    const dashboardTabButton = document.getElementById('showDashboardTab');
    const createTabButton = document.getElementById('showCreateTab');
    if (dashboardTabButton) {
        dashboardTabButton.addEventListener('click', async () => {
            showTab('dashboard');
            await displayAgents();
        });
    }
    if (createTabButton) createTabButton.addEventListener('click', () => showTab('create'));
    const createButton = document.getElementById('createAgentButton');

    createButton.addEventListener('click', async () => {
        const urlInput = document.getElementById('url')
        const agentTypeInput  = document.getElementById('type')
        const languageInput  = document.getElementById('language')
        const runEachInput  = document.getElementById('runEach')
        const user_id = localStorage.getItem('user_id') || '';
        // Prepare the data to be sent
        const agentData = {
            user_id: user_id,
            url: urlInput.value,
            type: agentTypeInput.value,
            language: languageInput.value,
            run_each: runEachInput.value
        };

        // Call the createAgent method
        try {
            const createdAgent = await agentApiWrapper.createAgent(agentData);
            console.log('Agent created:', createdAgent);
            // Handle the created agent (update UI, display message, etc.)
        } catch (error) {
            console.error('Error creating agent:', error);
            // Handle the error (display error message, etc.)
        }
        urlInput.value=''
        runEachInput.value=''
        });
});