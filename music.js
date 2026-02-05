const music = document.getElementById("bgMusic");
music.volume = 0.4;

// Check if this is the start page (beginning of the journey)
const isStartPage = window.location.pathname.endsWith("start.html");

// Restore the saved time IMMEDIATELY (before audio loads)
if (isStartPage) {
  // Reset music only on start page
  localStorage.removeItem("musicTime");
  music.currentTime = 0;
} else {
  // Resume from last saved time on all other pages
  const savedTime = localStorage.getItem("musicTime");
  if (savedTime) {
    try {
      music.currentTime = parseFloat(savedTime);
    } catch (e) {
      // If setting time fails, it's okay
    }
  }
}

// Track if music has been enabled by user
let musicEnabled = false;

// Function to play music
const playMusic = () => {
  if (!musicEnabled) {
    musicEnabled = true;
  }
  const playPromise = music.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay blocked, will play on next interaction
    });
  }
};

// Try to play immediately (works on desktop)
playMusic();

// For mobile: Enable audio on ANY user interaction
const enableAudioOnInteraction = () => {
  playMusic();
};

// Listen for all types of user interactions (important for mobile)
document.addEventListener("click", enableAudioOnInteraction);
document.addEventListener("touchstart", enableAudioOnInteraction);
document.addEventListener("touchend", enableAudioOnInteraction);
document.addEventListener("keydown", enableAudioOnInteraction);

// Also try when page becomes visible
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && musicEnabled) {
    playMusic();
  }
});

// Save current time continuously
setInterval(() => {
  if (!music.paused) {
    localStorage.setItem("musicTime", music.currentTime);
  }
}, 250);
