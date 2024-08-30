import express from 'express';
import fetch from 'node-fetch';
import multer from 'multer';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/generate', upload.single('file'), async (req, res) => {
    const prompt = req.body.prompt;
    const file = req.file;

    // Vous pouvez stocker ou traiter le fichier ici si nécessaire

    try {
        const response = await fetch(`https://llama3-70b.vercel.app/api?ask=${encodeURIComponent(prompt)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt, file: file ? file.originalname : null })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        res.json({ text: data.response || 'No response field in JSON' });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur de serveur' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
