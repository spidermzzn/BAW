// JavaScript for confession posting and managing

const confessionForm = document.getElementById("confessionForm");
const confessionInput = document.getElementById("confessionInput");
const confessionsContainer = document.getElementById("confessionsContainer");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const showLessBtn = document.getElementById("showLessBtn");

let confessions = [];
let visibleConfessions = 8;

// Function to fetch confessions from MongoDB
async function fetchConfessions() {
  try {
    const response = await fetch("http://localhost:5000/api/confessions"); // Corrected URL for the backend
    const data = await response.json();
    confessions = data;
    renderConfessions();
  } catch (error) {
    console.error("Error fetching confessions:", error);
  }
}

// Function to post a confession to MongoDB
async function postConfession(content) {
  const confession = {
    content,
    timestamp: new Date().toISOString(),
  };

  try {
    await fetch("http://localhost:5000/api/confessions", {
      // Corrected URL for the backend
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(confession),
    });
    fetchConfessions(); // Refresh the list of confessions after posting
  } catch (error) {
    console.error("Error posting confession:", error);
  }
}

// Function to calculate time since the confession was posted
function timeSince(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInMinutes = Math.floor((now - past) / 60000);

  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);

  return `${diffInDays} days ago`;
}

// Function to render confessions
function renderConfessions() {
  confessionsContainer.innerHTML = "";
  const toDisplay = confessions.slice(0, visibleConfessions);

  toDisplay.forEach((confession) => {
    const block = document.createElement("div");
    block.className = "confession-block";
    block.innerHTML = `
      <p>${confession.content}</p>
      <small>Posted ${timeSince(confession.timestamp)}</small>
    `;
    confessionsContainer.appendChild(block);
  });

  loadMoreBtn.style.display =
    confessions.length > visibleConfessions ? "block" : "none";
  showLessBtn.style.display = visibleConfessions > 8 ? "block" : "none";
}

// Event listener for form submission
confessionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const content = confessionInput.value.trim();
  if (content) {
    postConfession(content);
    confessionInput.value = "";
  }
});

// Event listener for load more button
loadMoreBtn.addEventListener("click", () => {
  visibleConfessions += 10;
  renderConfessions();
});

// Event listener for show less button
showLessBtn.addEventListener("click", () => {
  visibleConfessions = Math.max(8, visibleConfessions - 10);
  renderConfessions();
});

// Initial fetch to load confessions
fetchConfessions();
