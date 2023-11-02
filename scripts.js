import apiWrapper from './apiWrapper.js';

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
    const influences = [];
    const influenceInputs = document.querySelectorAll('.influence-input');
    for(let i=0; i<influenceInputs.length; i++) {
        influences.push({ spotifyId: influenceInputs[i].value });
    }

    const playlistData = {
        name: playlistName,
        description: playlistDescription,
        genre: playlistGenre,
        subGenre: playlistSubGenre,
        coverImage: playlistCoverImage
        //... (any other fields)
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


async function showPlaylists() {
    try {
        const playlists = await apiWrapper.getPlaylists();
        const container = document.getElementById('dashboard');
        container.innerHTML = ''; // Clear existing content

        if (playlists && playlists.length > 0) {
            playlists.forEach(playlist => {
                const div = document.createElement('div');
                div.className = 'playlist';
                div.innerHTML = `
                    <h3>${playlist.name}</h3>
                    <p>${playlist.description}</p>
                `;
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



// On page load, show the 'Create Playlist' tab
window.onload = function() {
    showTab('create');
}
let influenceCount = 1;

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