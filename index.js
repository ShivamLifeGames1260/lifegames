const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

const VAULT_PASSWORD = "1234"; // 🔐 CHANGE LATER SAFELY

app.use(express.json());
app.use(express.static("public"));

const vaultDir = path.join(__dirname, "storage", "vault");
if (!fs.existsSync(vaultDir)) fs.mkdirSync(vaultDir, { recursive: true });

const upload = multer({ dest: vaultDir });

app.post("/unlock", (req, res) => {
  if (req.body.password === VAULT_PASSWORD) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.post("/upload", upload.single("file"), (req, res) => {
  res.send("File uploaded successfully");
});

app.get("/vault-files", (req, res) => {
  fs.readdir(vaultDir, (err, files) => {
    res.json(files || []);
  });
});

app.get("/download/:name", (req, res) => {
  const filePath = path.join(vaultDir, req.params.name);
  res.download(filePath);
});

app.listen(PORT, () => {
  console.log("LifeGames running on port " + PORT);
});
