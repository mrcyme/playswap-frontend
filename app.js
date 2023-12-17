import playswapApiWrapper from './api/playswapApiWrapper.js';
import agentApiWrapper from './api/agentApiWrapper.js';

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const data = {
        email: email,
        password: password
    }
    // Send login information to server
    const dbResponse = await agentApiWrapper.loginUser(data);

    if (dbResponse.playswap_token) {
        localStorage.setItem('token', dbResponse.playswap_token);
        localStorage.setItem('user_id', dbResponse.user_id);
        window.location.href = 'playlistManager.html';  // Redirect to playlistManager.html
    } else {
        alert('Login failed');
    }
}

async function signup() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Replace this with the actual signup request to your authentication service
    const authResponse = await playswapApiWrapper.login(email, password);
    if (authResponse.token) {
        const data = {
            email: email,
            playswap_token: authResponse.token,
            password: password
        }
        // After successful authentication, create a user in the database
        const dbResponse = await agentApiWrapper.createUser(data);
        console.log(dbResponse)
        if (dbResponse && dbResponse.user_id) {
            alert('Signup successful. Redirecting to playlist manager.');
            localStorage.setItem('token', authResponse.token); // Save the token if necessary
            localStorage.setItem('user_id', dbResponse.user_id);
            window.location.href = 'playlistManager.html'; // Redirect to playlist manager
        } else {
            alert('Signup successful, but failed to create user in database.');
        }
    } else {
        alert('Signup failed');
    }
}


document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('loginButton').addEventListener('click', login);
    document.getElementById('signupButton').addEventListener('click', signup);
});
