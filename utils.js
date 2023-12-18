function createButton(text, eventListener, playlistId) {
    const button = document.createElement('button');
    button.innerText = text;
    button.setAttribute('data-playlist-id', playlistId);
    button.addEventListener('click', eventListener);
    return button;
}
export default createButton



