import playswapApiWrapper from './api/playswapApiWrapper.js';
// On page load, show the 'Create Playlist' tab
window.onload = function() {
    showTab('create');
}

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    
    document.getElementById(tabId).style.display = 'block';
}

// HANDLERS FOR playswapApiWrapper FUNCTIONS


async function submitGetPlaylists() {
    try {
        const playlists = await playswapApiWrapper.getPlaylists();
        const container = document.getElementById('dashboard');
        container.innerHTML = '';

        if (playlists && playlists.length > 0) {
            playlists.forEach(playlist => {
                const div = createPlaylistDiv(playlist);
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

async function submitGetCandidatePlaylists() {
    try {
        const playlists = await playswapApiWrapper.getCandidatePlaylists();
        const container = document.getElementById('candidate');
        container.innerHTML = '';

        if (playlists && playlists.length > 0) {
            playlists.forEach(playlist => {
                const div = createPlaylistDiv(playlist);
                container.appendChild(div);
            });
        } else {
            container.innerText = 'No candidate playlists found';
        }
    } catch (error) {
        console.error('Error fetching candidate playlists', error);
        container.innerText = 'Failed to load candidate playlists';
    }
}


async function submitCreatePlaylist() {
    const playlistNameInput = document.getElementById('name');
    const playlistDescriptionInput = document.getElementById('description');
    const imageInput = document.getElementById('imageUpload'); // Assuming you have an input with this id
    const influenceInputs = document.querySelectorAll('.influence-input');
  
    const playlistName = playlistNameInput.value;
    const playlistDescription = playlistDescriptionInput.value;
    const influences = [];
  
    for (let i = 0; i < influenceInputs.length; i++) {
      if (influenceInputs[i].value){
      influences.push({ uri: url_to_id(influenceInputs[i].value, "playlist") });
      }
    }
  
    const playlistData = {
      title: playlistName,
      description: playlistDescription,
    };
    try {
      const createdPlaylist = await playswapApiWrapper.createPlaylist(playlistData);
      //if (createdPlaylist.status !== 200) {
        //throw new Error('Failed to create playlist');
      //}
  
      for (const influence of influences) {
        await playswapApiWrapper.createInfluence(createdPlaylist.id, influence);
      
      }
      //upload cover

      getBase64String(imageInput.files).then(updateData => {
        const updatePlaylistData = {
            coverImage: updateData
          };
        console.log(updatePlaylistData);
        playswapApiWrapper.updatePlaylist(createdPlaylist.id, updatePlaylistData);
      }).catch(error => {
        console.error(error);
      });

      // Notify the user
      alert('Playlist created successfully!');
  
      // Clear the input fields
      playlistNameInput.value = '';
      playlistDescriptionInput.value = '';
      imageInput.value = ''; // Clear the image input
      influenceInputs.forEach(input => input.value = '');
  
    } catch (error) {
      throw error;
      console.error('Error message:', error.message);
        
      alert('Error creating playlist:', error);
    }
    // If there is an image to upload, read it and update the playlist
  }
  
async function submitDeletePlaylist(playlistId) {
    try {
        await playswapApiWrapper.deletePlaylist(playlistId);
        await submitGetPlaylists();  // Refresh the playlist display
    } catch (error) {
        console.error('Error deleting playlist:', error);
        alert('Failed to delete playlist');
    }
}

  
  // Function to submit the track and clear the input
async function submitAddTrack(playlistId, trackUrlInput) {
    try {
      const spotifyId = url_to_id(trackUrlInput.value, 'track');
      await playswapApiWrapper.createPriorityTrack(playlistId, spotifyId);
      // Clear the input field after successful submission
      trackUrlInput.value = '';
      // Hide the add track section after submission
      const addTrackDiv = document.getElementById(`add-track-for-${playlistId}`);
      if (addTrackDiv) {
        addTrackDiv.style.display = 'none';
      }
    } catch (error) {
      console.error('Error adding track:', error);
      alert('Failed to add track');
    }
  }

// Function to submit the influence and clear the input
async function submitAddInfluence(playlistId, influenceUriInput) {
    try {
      // You would have an API call here to add the influence
      await playswapApiWrapper.createInfluence(playlistId, { uri: url_to_id(influenceUriInput.value, "playlist") });
      // Clear the input field after successful submission
      influenceUriInput.value = '';
      // Hide the add influence section after submission
      const addInfluenceDiv = document.getElementById(`add-influence-for-${playlistId}`);
      if (addInfluenceDiv) {
        addInfluenceDiv.style.display = 'none';
      }
    } catch (error) {
      console.error('Error adding influence:', error);
      alert('Failed to add influence');
    }
}

// Function to handle the submission of the edited details
async function submitEditDetails(playlistId, title, description, files) {
    try {
        getBase64String(files).then(updateData => {
            console.log(updateData);
            const data = {
                name: title,
                description: description,
                coverImage: updateData
            };
            console.log(data);
            playswapApiWrapper.updatePlaylist(playlistId, data);
          }).catch(error => {
            console.error(error);
          });
        alert('Playlist updated successfully!');
        await submitGetPlaylists(); // Refresh the playlists display

    } catch (error) {
        throw error;
        console.error('Error updating playlist:', error);
        alert('Failed to update playlist');
    }
}


function addInfluenceInput() {
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



function createPlaylistDiv(playlist) {
    const div = document.createElement('div');
    div.className = 'playlist';

    // Check if the playlist has a Spotify URI and convert it to an anchor tag if it exists
    if (playlist.spotifyURI) {
        const url = uri_to_url(playlist.spotifyURI); // Ensure that uri_to_url function exists and works as expected
        div.innerHTML = `<h3><a href="${url}" target="_blank">${playlist.title}</a></h3>`;
    } else {
        div.innerHTML = `<h3>${playlist.title}</h3>`;
    }

    const tracklistButton = createButton('Tracklist', toggleTracklist, playlist.id);
    const deleteButton = createButton('Delete', () => submitDeletePlaylist(playlist.id));
    const influenceButton = createButton('Influences', toggleInfluenceList, playlist.id);

    const tracklistDiv = createTracklistDiv(playlist.id);
    const influenceDiv = createInfluenceDiv(playlist.id);

    // Create and append the "Add Track" button and its div
    const { addTrackButton, addTrackDiv } = createAddTrackElements(playlist.id);// Create and append the "Add Influence" button and its div
    const { addInfluenceButton, addInfluenceDiv } = createAddInfluenceElements(playlist.id);
    const { editDetailsButton, editDetailsDiv } = createEditDetailsElements(playlist.id);

    div.appendChild(tracklistButton);
    div.appendChild(influenceButton);
    div.appendChild(addTrackButton); // Append the "Add Track" button
    div.appendChild(addInfluenceButton); // Append the "Add Influence" button
    div.appendChild(editDetailsButton); // Append the "Edit Details" button
    div.appendChild(deleteButton);
    div.appendChild(tracklistDiv);
    div.appendChild(influenceDiv);
    div.appendChild(addTrackDiv); // Append the div for adding tracks
    // Append the "Add Influence" button and div
    div.appendChild(addInfluenceDiv);
    div.appendChild(editDetailsDiv);

    return div;
}

function createButton(text, eventListener, playlistId) {
    const button = document.createElement('button');
    button.innerText = text;
    button.setAttribute('data-playlist-id', playlistId);
    button.addEventListener('click', eventListener);
    return button;
}

function createTracklistDiv(playlistId) {
    const tracklistDiv = document.createElement('div');
    tracklistDiv.id = `tracklist-for-${playlistId}`;
    tracklistDiv.className = 'tracklist';
    tracklistDiv.style.display = 'none';
    return tracklistDiv;
}

function createInfluenceDiv(playlistId) {
    const influenceDiv = document.createElement('div');
    influenceDiv.id = `influence-for-${playlistId}`;
    influenceDiv.className = 'influence';
    influenceDiv.style.display = 'none';
    return influenceDiv;
}

// New function to create the "Add Track" button and its corresponding input and submit elements
function createAddTrackElements(playlistId) {
    const addTrackButton = createButton('Add Track', toggleAddTrackInput, playlistId);
    const addTrackDiv = document.createElement('div');
    addTrackDiv.id = `add-track-for-${playlistId}`;
    addTrackDiv.className = 'add-track';
    addTrackDiv.style.display = 'none';
  
    // Input for the track URL
    const trackUrlInput = document.createElement('input');
    trackUrlInput.type = 'text';
    trackUrlInput.placeholder = 'Track URL';
    trackUrlInput.className = 'track-url-input';
  
    // Submit button for adding the track
    const submitTrackButton = createButton('Submit', () => submitAddTrack(playlistId, trackUrlInput));
    submitTrackButton.className = 'submit-track-button';
  
    // Append the input and submit button to the addTrackDiv
    addTrackDiv.appendChild(trackUrlInput);
    addTrackDiv.appendChild(submitTrackButton);
  
    return { addTrackButton, addTrackDiv };
  }

// Function to create the "Edit Details" button and div
function createEditDetailsElements(playlistId) {
    const editDetailsButton = createButton('Edit Details', toggleEditDetailsDiv, playlistId);
    const editDetailsDiv = document.createElement('div');
    editDetailsDiv.id = `edit-details-for-${playlistId}`;
    editDetailsDiv.className = 'edit-details';
    editDetailsDiv.style.display = 'none';

    // Create input for the new title
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.placeholder = 'New title';
    titleInput.className = 'edit-title-input';

    // Create input for the new description
    const descriptionInput = document.createElement('textarea');
    descriptionInput.placeholder = 'New description';
    descriptionInput.className = 'edit-description-input';

    // Create input for the new image
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.className = 'edit-image-input';

    // Create a button to submit the new details
    const submitButton = createButton('Update Details', () => submitEditDetails(playlistId, titleInput.value, descriptionInput.value, imageInput.files));
    submitButton.className = 'submit-edit-details-button';

    // Append the inputs and submit button to the div
    editDetailsDiv.appendChild(titleInput);
    editDetailsDiv.appendChild(descriptionInput);
    editDetailsDiv.appendChild(imageInput);
    editDetailsDiv.appendChild(submitButton);

    return { editDetailsButton, editDetailsDiv };
}
  


// New function to create the "Add Influence" button and its corresponding input and submit elements
function createAddInfluenceElements(playlistId) {
    const addInfluenceButton = createButton('Add Influence', toggleAddInfluenceInput, playlistId);
    const addInfluenceDiv = document.createElement('div');
    addInfluenceDiv.id = `add-influence-for-${playlistId}`;
    addInfluenceDiv.className = 'add-influence';
    addInfluenceDiv.style.display = 'none';
  
    // Input for the influence URL
    const influenceUriInput = document.createElement('input');
    influenceUriInput.type = 'text';
    influenceUriInput.placeholder = 'Influence URL';
    influenceUriInput.className = 'influence-uri-input';
  
    // Submit button for adding the influence
    const submitInfluenceButton = createButton('Submit', () => submitAddInfluence(playlistId, influenceUriInput));
    submitInfluenceButton.className = 'submit-influence-button';
  
    // Append the input and submit button to the addInfluenceDiv
    addInfluenceDiv.appendChild(influenceUriInput);
    addInfluenceDiv.appendChild(submitInfluenceButton);
  
    return { addInfluenceButton, addInfluenceDiv };
}

// Function to toggle the add influence input field
function toggleAddInfluenceInput(event) {
    const playlistId = event.target.getAttribute('data-playlist-id');
    hideOtherSections(playlistId, 'add-influence');
    const addInfluenceDiv = document.getElementById(`add-influence-for-${playlistId}`);
    addInfluenceDiv.style.display = addInfluenceDiv.style.display === 'none' ? 'block' : 'none';
}


async function toggleTracklist(event) {
    const playlistId = event.target.getAttribute('data-playlist-id');
    hideOtherSections(playlistId, 'tracklist');
    // Use getElementById to select the tracklistDiv directly
    const tracklistDiv = document.getElementById(`tracklist-for-${playlistId}`);
    // Check if tracklist is already loaded
    if (tracklistDiv.innerHTML === '') {
        // Call the method to get the tracklist from the API
        try {
            
            const playlist = await playswapApiWrapper.getPlaylist(playlistId);
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
    hideOtherSections(playlistId, 'influence');
    const influenceDivId = `influence-for-${playlistId}`;
    const influenceDiv = document.getElementById(influenceDivId);

    // Check if the influence list is already loaded
    if (influenceDiv.innerHTML === '') {
        try {
            const influences = await playswapApiWrapper.getInfluences(playlistId);
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

 // Function to toggle the add track input field
function toggleAddTrackInput(event) {
    const playlistId = event.target.getAttribute('data-playlist-id');
    hideOtherSections(playlistId, 'add-track');
    const addTrackDiv = document.getElementById(`add-track-for-${playlistId}`);
    addTrackDiv.style.display = addTrackDiv.style.display === 'none' ? 'block' : 'none';
}


// Function to toggle the edit details div visibility
function toggleEditDetailsDiv(event) {
    const playlistId = event.target.getAttribute('data-playlist-id');
    hideOtherSections(playlistId, 'edit-details');
    const editDetailsDiv = document.getElementById(`edit-details-for-${playlistId}`);
    editDetailsDiv.style.display = editDetailsDiv.style.display === 'none' ? 'block' : 'none';
}



// Make sure to update the hideOtherSections function to include 'edit-details'
function hideOtherSections(playlistId, sectionToShow) {
    const sections = ['tracklist', 'influence', 'add-track', 'add-influence', 'edit-details'];
    sections.forEach(section => {
        if (section !== sectionToShow) {
            const div = document.getElementById(`${section}-for-${playlistId}`);
            if (div) {
                div.style.display = 'none';
            }
        }
    });

    // Also remove the active class from all buttons except the one clicked
    const buttons = ['tracklist', 'influence', 'add-track', 'add-influence', 'edit-details'];
    buttons.forEach(button => {
        const btn = document.querySelector(`[data-playlist-id="${playlistId}"].${button}-btn`);
        if (btn && button !== sectionToShow) {
            btn.classList.remove('button-active');
        }
    });
}



document.addEventListener('DOMContentLoaded', (event) => {
    const createTabButton = document.getElementById('showCreateTab');
    const dashboardTabButton = document.getElementById('showDashboardTab');
    const setTokenButton = document.getElementById('setTokenButton');
    const addInfluenceButton = document.getElementById('addInfluenceButton');
    const createPlaylistButton = document.getElementById('createPlaylistButton');
    const candidateTabButton = document.getElementById('showCandidateTabButton');
    if (createTabButton) createTabButton.addEventListener('click', () => showTab('create'));
    if (setTokenButton) setTokenButton.addEventListener('click', setToken);
    if (addInfluenceButton) addInfluenceButton.addEventListener('click', addInfluenceInput);
    if (createPlaylistButton) createPlaylistButton.addEventListener('click', submitCreatePlaylist);
    if (dashboardTabButton) {
        dashboardTabButton.addEventListener('click', async () => {
            showTab('dashboard');
            await submitGetPlaylists();
        });
    if (candidateTabButton) {
        candidateTabButton.addEventListener('click', async () => {
            showTab('candidate');
            await submitGetCandidatePlaylists();
        });
    }
    };
}     // other code that needs to run after the DOM is loaded
)

function url_to_id(url, type) {
    if (!['track', 'playlist', 'album'].includes(type)) {
      throw new Error('Invalid type specified. Type must be one of "track", "playlist", or "album".');
    }
  
    // This pattern dynamically inserts the specified type into the regular expression
    const pattern = new RegExp(`${type}/([a-zA-Z0-9]+)(?:\\?|$)`);
    const match = url.match(pattern);
  
    if (match) {
      return match[1];
    } else {
      throw new Error(`Not the right Spotify object (should be ${type})`);
    }
  }


function uri_to_url(uri) {
    const parts = uri.split(':');
    if (parts.length === 3 && (parts[0] === 'spotify') && (parts[1] === 'playlist' || parts[1] === 'track')) {
      return `https://open.spotify.com/${parts[1]}/${parts[2]}`;
    } else {
      throw new Error('Invalid Spotify URI');
    }
  }
  


  function getBase64String(files) {
    // Return a new Promise
    return new Promise((resolve, reject) => {
      if (files.length > 0) {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const imageBase64 = e.target.result.split(',')[1]; // Extract only the base64 encoded string
          resolve(imageBase64); // Resolve the Promise with the updateData object
        };
        fileReader.onerror = (e) => {
          reject(new Error("Failed to read file")); // Reject the Promise if there's an error
        };
        fileReader.readAsDataURL(files[0]);
      } else {
        reject(new Error("No files provided")); // Reject the Promise if no files were provided
      }
    });
  }
  