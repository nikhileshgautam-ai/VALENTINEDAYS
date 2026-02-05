const music = document.getElementById("bgMusic");
music.volume = 0.4;

// Check if this is the start page (beginning of the journey)
const isStartPage = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/");

// Restore the saved time IMMEDIATELY (before audio loads)
if (isStartPage) {
  // Reset music only on start page
  localStorage.removeItem("musicTime");
  music.currentTime = 0;
} else {
  // Resume from last saved time on all other pages (including index.html)
  const savedTime = localStorage.getItem("musicTime");
  if (savedTime) {
    try {
      music.currentTime = parseFloat(savedTime);
    } catch (e) {
      // If setting time fails, it's okay
    }
  }
}

// Function to play music
const tryPlay = () => {
  music.play().catch(() => {
    // If autoplay fails, wait for user interaction
    document.addEventListener("click", () => {
      music.play().catch(() => {});
    }, { once: true });
  });
};

// Wait for audio to be ready, then play
if (music.readyState >= 2) {
  // Audio is already loaded enough
  tryPlay();
} else {
  // Wait for audio to load
  music.addEventListener("canplay", tryPlay, { once: true });
}

// Save current time continuously
setInterval(() => {
  if (!music.paused) {
    localStorage.setItem("musicTime", music.currentTime);
  }
}, 250);
