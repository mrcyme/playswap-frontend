import agentApiWrapper from './api/agentApiWrapper.js';

document.addEventListener('DOMContentLoaded', () => {
    const createButton = document.getElementById('createAgentButton');
    console.log(createButton);

    createButton.addEventListener('click', async () => {
        const url = document.getElementById('url').value;
        const agentType = document.getElementById('type').value;
        const language = document.getElementById('language').value;
        const runEach = document.getElementById('runEach').value;
        const user_id = localStorage.getItem('user_id') || '';
        // Prepare the data to be sent
        const agentData = {
            user_id: user_id,
            url: url,
            type: agentType,
            language: language,
            run_each: runEach
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
    });
});