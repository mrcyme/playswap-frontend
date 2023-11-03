import apiWrapper from './apiWrapper.js';
// On page load, show the 'Create Playlist' tab
window.onload = function() {
    showTab('create');
}

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    
    document.getElementById(tabId).style.display = 'block';
}

function setToken() {
    const token = document.getElementById('tokenInput').value;
    apiWrapper.setToken(token);
}



async function createPlaylist() {
    const playlistName = document.getElementById('name').value;
    const playlistDescription = document.getElementById('description').value;
    const influences = [];
    const influenceInputs = document.querySelectorAll('.influence-input');
    for(let i=0; i<influenceInputs.length; i++) {
        influences.push({ uri: influenceInputs[i].value });
    }

    const playlistData = {
        name: playlistName,
        description: playlistDescription,
        //... other fields
    };

    try {
        const createdPlaylist = await apiWrapper.createPlaylist(playlistData);
        for (const influence of influences) {
            await apiWrapper.createInfluence(createdPlaylist.id, influence);
        }

        alert('Playlist created successfully!');
    } catch (error) {
        console.error('Error creating playlist:', error);
        alert('Failed to create playlist');
    }
}

function addInfluence() {
    // Create a new input field
    const newInfluenceInput = document.createElement('input');
    newInfluenceInput.type = "text";
    newInfluenceInput.className = "influence-input";

    // Create a new div to wrap the input and the button
    const newRow = document.createElement('div');
    newRow.className = 'influence-row';

    // Append the new input to the new div
    newRow.appendChild(newInfluenceInput);

    // Move the "Add Influence" button to the new div
    const addButton = document.querySelector('.influence-row button');
    newRow.appendChild(addButton);

    // Append the new div to the influencesContainer
    const influencesContainer = document.getElementById('influencesContainer');
    influencesContainer.appendChild(newRow);
}


async function showPlaylists() {
    try {
        const playlists = await apiWrapper.getPlaylists();
        const container = document.getElementById('dashboard');
        container.innerHTML = '';

        if (playlists && playlists.length > 0) {
            playlists.forEach(playlist => {
                const div = document.createElement('div');
                div.className = 'playlist';
                
                // Create the tracklist button
                const tracklistButton = document.createElement('button');
                tracklistButton.innerText = 'Tracklist';
                // Set a data attribute to store the playlist ID
                tracklistButton.setAttribute('data-playlist-id', playlist.id);
                tracklistButton.addEventListener('click', toggleTracklist);
                
                // Create the delete button
                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.addEventListener('click', () => deletePlaylist(playlist.id));

                // Create the influence button
                const influenceButton = document.createElement('button');
                influenceButton.innerText = 'Influences';
                // Set a data attribute to store the playlist ID
                influenceButton.setAttribute('data-playlist-id', playlist.id);
                influenceButton.addEventListener('click', toggleInfluenceList);
                
                div.innerHTML = `
                    <h3>${playlist.title}</h3>
                `;  
                
                // Immediately create and append the tracklistDiv after the tracklistButton
                // Give your tracklistDiv a unique ID based on the playlist ID
                const tracklistDiv = document.createElement('div');
                tracklistDiv.id = `tracklist-${playlist.id}`;
                tracklistDiv.className = 'tracklist';
                tracklistDiv.style.display = 'none'; // Initially hide the tracklist

                // Append the elements to the playlist div

                // Placeholder element for the influence list
                const influenceDiv = document.createElement('div');
                influenceDiv.id = `influence-for-${playlist.id}`; // Ensure this ID is unique
                influenceDiv.className = 'influence';
                influenceDiv.style.display = 'none'; // Initially hide the influence list
                
                // Append the buttons and tracklistDiv in the correct order
                div.appendChild(tracklistButton);
                div.appendChild(influenceButton);
                div.appendChild(deleteButton);
                div.appendChild(tracklistDiv); // The tracklistDiv is now in between the tracklistButton and deleteButton
                div.appendChild(influenceDiv);
                container.appendChild(div);
            });
        } else {
            container.innerText = 'No playlists found';
        }
    } catch (error) {
        console.error('Error fetching playlists', error);
        document.getElementById('dashboard').innerText = 'Failed to load playlists';
    }
}

async function toggleTracklist(event) {
    const playlistId = event.target.getAttribute('data-playlist-id');
    // Use getElementById to select the tracklistDiv directly
    const tracklistDiv = document.getElementById(`tracklist-${playlistId}`);
    // Check if tracklist is already loaded
    if (tracklistDiv.innerHTML === '') {
        // Call the method to get the tracklist from the API
        try {
            
            const playlist = await apiWrapper.getPlaylist(playlistId);
            // Map each track to a list item string
            const tracksHtml = playlist.tracks.map(track => `<li>${track.title} by ${track.artists}</li>`).join('');
            tracklistDiv.innerHTML = `<ul>${tracksHtml}</ul>`;
            tracklistDiv.style.display = 'block';
        } catch (error) {
            console.error('Error fetching tracklist', error);
            tracklistDiv.innerText = 'Failed to load tracklist';
        }
    } else {
        // Toggle display of the tracklist
        tracklistDiv.style.display = tracklistDiv.style.display === 'none' ? 'block' : 'none';
    }
    // Inside the toggleTracklist function, before toggling the tracklist
    if (tracklistDiv.style.display === '' || tracklistDiv.style.display === 'none') {
        event.target.classList.add('button-active');
    } else {
        event.target.classList.remove('button-active');
    }
}

// New function to toggle the influence list
async function toggleInfluenceList(event) {
    const playlistId = event.target.getAttribute('data-playlist-id');
    const influenceDivId = `influence-for-${playlistId}`;
    const influenceDiv = document.getElementById(influenceDivId);

    // Check if the influence list is already loaded
    if (influenceDiv.innerHTML === '') {
        try {
            const influences = await apiWrapper.getInfluences(playlistId);
            // Map each influence to a list item string
            const influencesHtml = influences.map(influence => `<li>URI: ${influence.uri}</li>`).join('');
            influenceDiv.innerHTML = `<ul>${influencesHtml}</ul>`;
            influenceDiv.style.display = 'block'; // Show the influence list
        } catch (error) {
            console.error('Error fetching influence list', error);
            influenceDiv.innerText = 'Failed to load influence list';
        }
    } else {
        // Toggle display of the influence list
        influenceDiv.style.display = influenceDiv.style.display === 'none' ? 'block' : 'none';
    }
}


async function deletePlaylist(playlistId) {
    try {
        await apiWrapper.deletePlaylist(playlistId);
        await showPlaylists();  // Refresh the playlist display
    } catch (error) {
        console.error('Error deleting playlist:', error);
        alert('Failed to delete playlist');
    }
}




document.addEventListener('DOMContentLoaded', (event) => {
    const createTabButton = document.getElementById('showCreateTab');
    const dashboardTabButton = document.getElementById('showDashboardTab');
    const setTokenButton = document.getElementById('setTokenButton');
    const addInfluenceButton = document.getElementById('addInfluenceButton');
    const createPlaylistButton = document.getElementById('createPlaylistButton');


    if (createTabButton) createTabButton.addEventListener('click', () => showTab('create'));
    if (setTokenButton) setTokenButton.addEventListener('click', setToken);
    if (addInfluenceButton) addInfluenceButton.addEventListener('click', addInfluence);
    if (createPlaylistButton) createPlaylistButton.addEventListener('click', createPlaylist);
    if (dashboardTabButton) {
        dashboardTabButton.addEventListener('click', async () => {
            showTab('dashboard');
            await showPlaylists();
        });
    };
}
    
    // other code that needs to run after the DOM is loaded
)
