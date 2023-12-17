// loadHeader.js
document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.getElementById('headerContainer');
    if (headerContainer) {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                headerContainer.innerHTML = data;
            })
            .catch(error => console.error('Error loading the header:', error));
    }
});
