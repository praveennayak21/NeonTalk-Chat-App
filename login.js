// ===========================
//  NEONTALK — login.js
// ===========================

let selectedAvatar = "🦊";

// ---- Avatar picker ----
document.querySelectorAll(".avatar-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".avatar-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedAvatar = btn.dataset.avatar;
  });
});

// ---- Enter chat ----
document.getElementById("btnEnter").addEventListener("click", enterChat);
document.getElementById("usernameInput").addEventListener("keydown", e => {
  if (e.key === "Enter") enterChat();
});

function enterChat() {
  const input = document.getElementById("usernameInput");
  const hint  = document.getElementById("inputHint");
  const name  = input.value.trim().replace(/\s+/g, "");

  // Validation
  if (name.length < 2) {
    hint.textContent = "⚠️ Username must be at least 2 characters!";
    hint.classList.add("error");
    input.focus();
    return;
  }

  // Save to localStorage
  localStorage.setItem("nt_user", JSON.stringify({
    name,
    avatar: selectedAvatar,
    joinedAt: Date.now()
  }));

  // Go to chat
  window.location.href = "chat.html";
}

// ---- If already logged in, skip to chat ----
const existing = localStorage.getItem("nt_user");
if (existing) {
  const user = JSON.parse(existing);
  document.getElementById("usernameInput").value = user.name;
  // Pre-select avatar
  document.querySelectorAll(".avatar-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.dataset.avatar === user.avatar) {
      btn.classList.add("active");
      selectedAvatar = user.avatar;
    }
  });
}

// Clear error on input
document.getElementById("usernameInput").addEventListener("input", () => {
  const hint = document.getElementById("inputHint");
  hint.textContent = "2–20 characters, no spaces";
  hint.classList.remove("error");
});
