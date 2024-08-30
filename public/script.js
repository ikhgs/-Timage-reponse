document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const prompt = document.getElementById('prompt-input').value;
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    const responseBox = document.getElementById('response');

    if (prompt.trim() === '' && !file) return;

    responseBox.innerHTML = '<p>Loading...</p>';

    const formData = new FormData();
    formData.append('prompt', prompt);
    if (file) {
        formData.append('image', file);
    }

    try {
        const response = await fetch('/api/process', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        responseBox.innerHTML = `<p>${data.response || 'No response received'}</p>`;
    } catch (error) {
        responseBox.innerHTML = '<p>Error occurred. Please try again.</p>';
    }
});
