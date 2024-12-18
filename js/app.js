import { initializeStars, Star } from './stararea.js';

// Reference to canvas element and its drawing context
const canvas = document.getElementById('starareaCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to match full viewport size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize core variables
let stars = []; // Array to hold star objects
let numStars = 500; // Initial number of stars to render
let speed = 0; // Current travel speed
const maxSpeed = 100; // Maximum allowable travel speed
const lightSpeedThreshold = 80; // Threshold to trigger visual feedback for lightspeed
let isFacingForward = true; // Direction flag: true for "Front", false for "Back"

// Initialize stars on canvas. Seeds star area with given number of stars.
// Give each star own position, velocity, and rendering characteristics.
function initStars() {
  stars = initializeStars(canvas, ctx, numStars);
}

// Update speed display element based on current speed percentage.
// Give visual feedback to user, showing how close to "light speed".
function updateSpeedText() {
  const speedPercentage = Math.floor((speed / maxSpeed) * 100);
  document.getElementById('speedText').textContent = `${speedPercentage}% Speed of Light`;
}

// Update direction display element to show facing "Front" or "Back".
// Show direction star area is rendered towards.
function updateDirectionText() {
  document.getElementById('directionText').textContent = isFacingForward ? 'Front' : 'Back';
}

// Main animation loop. Clear canvas and updates/draws each star.
// Stars move when speed > 0. requestAnimationFrame ensures smooth animation with browser's refresh rate.
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star) => {
    if (speed > 0) {
      // Update star behavior based on current speed, direction, and thresholds like lightspeed.
      star.update(speed, isFacingForward, lightSpeedThreshold, maxSpeed);
    }
    // Draw star at its current position. Encapsulate inside Star instance.
    star.draw();
  });

  requestAnimationFrame(animate); // Schedule next frame for smooth animation
}

// EVENT HANDLERS
// Toggle facing direction of the stararea. Reverse perceived travel direction.
document.getElementById('turnAroundBtn').addEventListener('click', () => {
  isFacingForward = !isFacingForward; // Flip direction flag
  updateDirectionText(); // Refresh direction text
});

// Increase travel speed by 1 unit if not the maximum. Update UI accordingly.
document.getElementById('increaseSpeedBtn').addEventListener('click', () => {
  if (speed < maxSpeed) speed += 1; // Prevent exceeding max speed
  updateSpeedText(); // Refresh speed display
});

// Decrease travel speed by 1 unit if above zero. Update UI accordingly.
document.getElementById('decreaseSpeedBtn').addEventListener('click', () => {
  if (speed > 0) speed -= 1; // Prevent negative speed values
  updateSpeedText(); // Refresh speed display
});

// Increase star count to get denser star area view. Reinitialize to reflect changes.
document.getElementById('forwardBtn').addEventListener('click', () => {
  numStars += 100; // Increase star count
  initStars(); // Reinitialize with updated star count
});

// Decrease star count to thin out the star area. Keep it above a reasonable minimum to avoid empty screen.
document.getElementById('reverseBtn').addEventListener('click', () => {
  if (numStars > 100) {
    numStars -= 100; // Decrease star count
    initStars(); // Reinitialize with updated star count
  }
});

// Reset simulation to initial state: speed zero, facing forward, and original star configuration.
document.getElementById('resetBtn').addEventListener('click', () => {
  speed = 0; // Reset speed to zero
  isFacingForward = true; // Reset facing direction to forward
  initStars(); // Reinitialize stars
  updateSpeedText(); // Refresh speed display
  updateDirectionText(); // Refresh direction display
});

// On window resize, re-adjust canvas dimensions and re-initialize the stararea.
// Ensure star distribution is always correct and render looks proper at any viewport size.
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth; // Update canvas width
  canvas.height = window.innerHeight; // Update canvas height
  initStars(); // Reinitialize star area
});

// INITIALIZATION
// Kick off simulation by initializing stars, updating UI, and start animation loop.
initStars(); // Seed star array
updateSpeedText(); // Initialize speed display
updateDirectionText(); // Initialize direction display
animate(); // Start animation loop
