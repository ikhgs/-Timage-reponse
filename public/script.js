document.getElementById('attach-button').addEventListener('click', () => {
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (file) {
        document.getElementById('prompt-input').value = file.name; // Affiche le nom du fichier dans le champ de texte
    }
});

document.getElementById('send-button').addEventListener('click', async () => {
    const promptInput = document.getElementById('prompt-input');
    const prompt = promptInput.value;
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!prompt.trim() && !file) return;

    const responseBox = document.getElementById('response');
    responseBox.innerHTML += `<p>User: ${prompt}</p>`;
    responseBox.innerHTML += '<p>Loading...</p>';

    const formData = new FormData();
    formData.append('prompt', prompt);
    if (file) {
        formData.append('file', file);
    }

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        responseBox.innerHTML += `<p>Bot: ${data.text}</p>`;
    } catch (error) {
        responseBox.innerHTML += '<p>Error occurred. Please try again.</p>';
    }

    // Réinitialiser les champs après l'envoi
    promptInput.value = '';
    fileInput.value = '';
});
