## Codebase Overview

The codebase primarily consists of 5 files:

1. `styles.css`: Cascading stylesheet used for applying styles and organizing the layout of the application.
2. `index.html`: HTML structure of the application rendering different components, including input fields, tabs, and buttons for creating playlists and managing tokens.
3. `README.md`: Markdown file for project documentation.
4. `scripts.js`: Contains core JavaScript functions for manipulating the data and interacting with the apiWrapper.js file.
5. `apiWrapper.js`: Provides an interface for interacting with the external backend API.

## Code Organization

The codebase is simple and easy to understand, spread across five files each with a distinct role.

- `styles.css`: Contains CSS styles for different components including the body, inputs, buttons and divs. It also includes styles for different behaviors like showing and hiding tabs.

- `index.html` : The main HTML file which is responsible for the rendering of UI. There are two key sections, "Create" which allows the creation of new playlists and "Dashboard" which displays existing playlists.

- `README.md`: A markdown file, currently containing only a brief overview of the codebase.

- `scripts.js`: This file has several JavaScript functions like `setToken`, `showTab`, `createPlaylist`, `showPlaylists`, responsible for manipulating data on the UI and interacting with the API.

- `apiWrapper.js`: A dedicated file for handling all API calls, this file primarily provides an interface for interacting with the backend API. It has several functions to create playlists, get playlists, delete playlist, handle influences and manage priority tracks.

## Functionality and Methods

`scripts.js`:

- The `setToken` function gets the token value from the 'tokenInput' element and calls `apiWrapper.setToken`.

- The `createPlaylist` function creates a playlist from user inputted data and fetches playlistId from `apiWrapper.createPlaylist` for API interaction.

- The `showPlaylists` function fetches all playlists and displays them on the dashboard.

- The `addInfluence` function creates new input fields for influences.

- Utility functions like `hideOtherSections`, `createButton`, `createTracklistDiv`, `createInfluenceDiv`,`toggleAddTrackInput` provide supporting functionalities to manage the UI and data management.

`apiWrapper.js`: 

- The `setToken` function sets the token for API interactions.

- The `createPlaylist` function sends a POST request to the API with the playlist to be created.

- The `getPlaylist` function retrieves a playlist given a playlist ID.

- The `getPlaylists`, `updatePlaylist` and `deletePlaylist` perform corresponding actions on the playlists collection with the API.

- Functions for influences and priority tracks also interact with the API while performing actions related to influences and priority tracks.

## Code Examples and Usage

To create a new playlist, the `createPlaylist` function is used as demonstrated:

```javascript
// Create a new playlist
async function createPlaylist() {
    // ... (User input retrieval)
    const createdPlaylist = await apiWrapper.createPlaylist(playlistData);
    // Further actions after playlist creation
}
```

This function fetches the user inputs, then sends a request to create a playlist using the `apiWrapper.createPlaylist` function. The function then creates each influence the user had inputted and notifies the user of the result.

## Dependencies and External Libraries

The codebase is in pure JavaScript, CSS and HTML with zero external libraries. All functionalities are achieved with native JavaScript and built-in browser APIs only. The key API used here is 'https://playswap-server.azurewebsites.net' as mentioned in the apiWrapper.js file.

## Environment and Setup

This web app does not need any particular setup, just open the HTML file in a browser capable of understanding ES6 imports. The codebase requires this backend API to interact with 'https://playswap-server.azurewebsites.net'. 

You may prefer to use an HTTP server to serve these files due to ES6 module CORS policy in some browsers. For instance Node.js users can install 'http-server' via npm to serve these files. 

Environment variables and configuration for the backend API should be managed separately and are not visible in the codebase. 

Remember to change the API_URL variable in apiWrapper.js if you have a different API server URL.
