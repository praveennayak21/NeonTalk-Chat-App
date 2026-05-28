// ===========================
//  NEONTALK — chat.js
// ===========================

// ---- Auth check ----
const userRaw = localStorage.getItem("nt_user");
if (!userRaw) { window.location.href = "index.html"; }
const user = JSON.parse(userRaw);

// ---- State ----
let currentRoom = "general";

const ROOM_DESCS = {
  general: "General discussion",
  tech:    "Tech talk & coding",
  random:  "Anything goes",
  jobs:    "Job hunting & career"
};

const SEED_MESSAGES = {
  general: [
    { name: "🦁 Alex", avatar: "🦁", text: "Hey everyone! Welcome to NeonTalk 👋", time: "4:00 PM", own: false },
    { name: "🤖 Bot",  avatar: "🤖", text: "This is a real-time chat app built with vanilla JS!", time: "4:01 PM", own: false },
  ],
  tech: [
    { name: "🐸 Dev",  avatar: "🐸", text: "Anyone using TypeScript these days?", time: "3:45 PM", own: false },
    { name: "🧠 Sage", avatar: "🧠", text: "TypeScript is a must for large projects!", time: "3:46 PM", own: false },
  ],
  random: [
    { name: "👾 Ghost", avatar: "👾", text: "What's everyone having for lunch? 🍕", time: "2:30 PM", own: false },
  ],
  jobs: [
    { name: "🔥 Jay",  avatar: "🔥", text: "Just landed my first dev job! 🎉", time: "1:15 PM", own: false },
    { name: "🦊 Sam",  avatar: "🦊", text: "Congrats!! Any tips for interviews?", time: "1:16 PM", own: false },
  ]
};

// ---- Load messages from localStorage ----
function getMessages(room) {
  const stored = localStorage.getItem(`nt_msgs_${room}`);
  if (stored) return JSON.parse(stored);
  // Seed default messages
  localStorage.setItem(`nt_msgs_${room}`, JSON.stringify(SEED_MESSAGES[room] || []));
  return SEED_MESSAGES[room] || [];
}

function saveMessages(room, messages) {
  localStorage.setItem(`nt_msgs_${room}`, JSON.stringify(messages));
}

// ---- Format time ----
function formatTime(date = new Date()) {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// ---- Render messages ----
function renderMessages(room) {
  const list = document.getElementById("messagesList");
  const messages = getMessages(room);

  list.innerHTML = "";

  // System join message
  const joinMsg = document.createElement("div");
  joinMsg.className = "message system";
  joinMsg.innerHTML = `<div class="msg-text">You joined #${room}</div>`;
  list.appendChild(joinMsg);

  messages.forEach(msg => {
    const isOwn = msg.name === `${user.avatar} ${user.name}`;
    const el = document.createElement("div");
    el.className = `message ${isOwn ? "own" : ""}`;
    el.innerHTML = `
      <div class="msg-avatar">${msg.avatar}</div>
      <div class="msg-body">
        <div class="msg-meta">
          <span class="msg-name">${msg.name}</span>
          <span class="msg-time">${msg.time}</span>
        </div>
        <div class="msg-text">${escapeHTML(msg.text)}</div>
      </div>
    `;
    list.appendChild(el);
  });

  // Scroll to bottom
  const wrap = document.getElementById("messagesWrap");
  wrap.scrollTop = wrap.scrollHeight;
}

// ---- Escape HTML to prevent XSS ----
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---- Send message ----
function sendMessage() {
  const input = document.getElementById("messageInput");
  const text  = input.value.trim();
  if (!text) return;

  const messages = getMessages(currentRoom);
  messages.push({
    name:   `${user.avatar} ${user.name}`,
    avatar: user.avatar,
    text,
    time:   formatTime(),
    own:    true
  });

  saveMessages(currentRoom, messages);
  input.value = "";
  renderMessages(currentRoom);
}

// ---- Switch room ----
function switchRoom(room) {
  currentRoom = room;

  // Update active room in sidebar
  document.querySelectorAll(".room-item").forEach(item => {
    item.classList.toggle("active", item.dataset.room === room);
  });

  // Update header
  document.getElementById("chatRoomName").textContent = room;
  document.getElementById("chatRoomDesc").textContent = ROOM_DESCS[room] || "";
  document.getElementById("messageInput").placeholder = `Message #${room}…`;

  renderMessages(room);
}

// ---- Event listeners ----

// Send on button click
document.getElementById("btnSend").addEventListener("click", sendMessage);

// Send on Enter key
document.getElementById("messageInput").addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Room switching
document.querySelectorAll(".room-item").forEach(item => {
  item.addEventListener("click", () => switchRoom(item.dataset.room));
});

// Emoji picker
const btnEmoji    = document.getElementById("btnEmoji");
const emojiPicker = document.getElementById("emojiPicker");

btnEmoji.addEventListener("click", (e) => {
  e.stopPropagation();
  emojiPicker.classList.toggle("open");
});

emojiPicker.addEventListener("click", (e) => {
  const emoji = e.target.textContent.trim();
  if (emoji) {
    const input = document.getElementById("messageInput");
    input.value += emoji;
    input.focus();
    emojiPicker.classList.remove("open");
  }
});

document.addEventListener("click", () => emojiPicker.classList.remove("open"));

// Logout
document.getElementById("btnLogout").addEventListener("click", () => {
  if (confirm("Leave chat?")) {
    localStorage.removeItem("nt_user");
    window.location.href = "index.html";
  }
});

// ---- Init ----
document.getElementById("sidebarAvatar").textContent = user.avatar;
document.getElementById("sidebarName").textContent   = user.name;

switchRoom("general");
