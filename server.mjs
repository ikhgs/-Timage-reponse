import express from 'express';
import multer from 'multer';
import fetch from 'node-fetch';
import axios from 'axios';
import FormData from 'form-data';
import path from 'path';

const app = express();
const upload = multer({ dest: 'uploads/' }); // Dossier temporaire pour les images

const apiUrlProcess = 'https://api-milay-gemini.vercel.app/api/process';
const apiUrlQuery = 'https://api-milay-gemini.vercel.app/api/query';

app.use(express.static('public'));
app.use(express.json());

// Route pour traiter les images et les prompts
app.post('/api/process', upload.single('image'), async (req, res) => {
    const prompt = req.body.prompt;
    const imageFile = req.file;

    if (!prompt || !imageFile) {
        return res.status(400).json({ error: 'Prompt and image are required' });
    }

    try {
        const form = new FormData();
        form.append('prompt', prompt);
        form.append('image', fs.createReadStream(path.join(__dirname, 'uploads', imageFile.filename)), { filename: imageFile.originalname });

        const response = await axios.post(apiUrlProcess, form, { headers: form.getHeaders() });
        const data = response.data;
        res.json({ response: data.response });
    } catch (error) {
        console.error('Error processing image and prompt:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Route pour traiter les prompts uniquement
app.get('/api/query', async (req, res) => {
    const prompt = req.query.prompt;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const response = await axios.get(apiUrlQuery, { params: { prompt } });
        const data = response.data;
        res.json({ response: data.response });
    } catch (error) {
        console.error('Error processing prompt:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
