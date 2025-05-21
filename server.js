const express = require('express');
const gTTS = require('gtts');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/tts', (req, res) => {
  const { text, lang = 'en' } = req.body;

  if (!text) {
    return res.status(400).send('No text provided');
  }

  const filename = `speech_${Date.now()}.mp3`;
  const filepath = path.join(__dirname, filename);
  const gtts = new gTTS(text, lang);

  gtts.save(filepath, function (err) {
    if (err) {
      return res.status(500).send('Failed to generate speech');
    }

    res.download(filepath, filename, () => {
      fs.unlink(filepath, () => {});
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TTS server running at http://localhost:${PORT}`);
});
