// 50 games
for (let i = 1; i <= 50; i++) {
  const d = document.createElement("div");
  d.textContent = "Game " + i;
  d.className = "game";
  document.getElementById("games").appendChild(d);
}

// Hidden vault trigger
let taps = 0;
document.getElementById("logo").onclick = () => {
  taps++;
  if (taps === 7) unlock();
};

function unlock() {
  const p = prompt("Enter vault password");
  fetch("/unlock", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: p })
  })
  .then(r => r.json())
  .then(d => {
    if (d.success) {
      document.getElementById("vault").style.display = "block";
      loadFiles();
    } else alert("Wrong password");
  });
}

function loadFiles() {
  fetch("/vault-files")
    .then(r => r.json())
    .then(files => {
      const ul = document.getElementById("files");
      ul.innerHTML = "";
      files.forEach(f => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="/download/${f}">${f}</a>`;
        ul.appendChild(li);
      });
    });
}
