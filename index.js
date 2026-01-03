require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(express.static('public'));

// Storage folder
const storageDir = path.join(__dirname, 'storage');
if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir);

// Multer setup
const upload = multer({ dest: storageDir });

// Vault password
const PASSWORD = process.env.VAULT_PASSWORD || "wasushiv";

// Simple session to track unlock (in memory)
let vaultUnlocked = false;

// Unlock vault
app.post('/unlock', (req, res) => {
    const { password } = req.body;
    if(password === PASSWORD){
        vaultUnlocked = true;
        res.json({ success:true });
    } else {
        res.json({ success:false });
    }
});

// Upload file
app.post('/upload', upload.single('file'), (req,res) => {
    if(!vaultUnlocked){
        return res.status(403).send("Vault locked");
    }
    res.send("File uploaded successfully!");
});

// List files
app.get('/vault-files', (req,res) => {
    if(!vaultUnlocked){
        return res.status(403).send("Vault locked");
    }
    const files = fs.readdirSync(storageDir);
    res.json(files);
});

// Download file
app.get('/download/:filename', (req,res) => {
    if(!vaultUnlocked){
        return res.status(403).send("Vault locked");
    }
    const filePath = path.join(storageDir, req.params.filename);
    if(fs.existsSync(filePath)){
        res.download(filePath);
    } else {
        res.status(404).send("File not found");
    }
});

app.listen(PORT, () => {
    console.log(`LifeGames running at http://localhost:${PORT}`);
});
