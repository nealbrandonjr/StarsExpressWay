export class Star {
  constructor(canvas, ctx) {
    // Each Star instance is given reference to the canvas and its rendering context.
    // Reset() to randomize star's initial position and appearance.
    this.canvas = canvas;
    this.ctx = ctx;
    this.reset(); // Initialize star with random position and appearance
  }

  reset() {
    // Randomly position star within a space that extends from canvas center.
    // Initial z-value determines depth, and prevZ for motion calculations.
    this.x = Math.random() * this.canvas.width - this.canvas.width / 2;
    this.y = Math.random() * this.canvas.height - this.canvas.height / 2;
    this.z = Math.random() * this.canvas.width; // Depth value for star position
    this.prevZ = this.z; // Store previous z-coordinate for motion trails
    
    // Assign a randomized color.
    this.color = this.getRandomStarColor();
    
    // Alpha for star's transparency
    this.alpha = 1;
  }

  update(speed, isFacingForward, lightSpeedThreshold, maxSpeed) {
    // Store previous z-value to draw motion trails between previous and current positions.
    this.prevZ = this.z;

    // Move star closer or farther depending on direction. If facing forward, z decreases as if moving "into" the screen.
    if (speed > 0) {
      this.z -= isFacingForward ? speed * 0.5 : -speed * 0.5;
    }

    // If a star passes behind viewer (z <= 0) or far beyond the "horizon" (z >= canvas width), then reset back into view.
    if (this.z <= 0 || this.z >= this.canvas.width) {
      this.reset();
    }

    // At speed threshold (lightSpeedThreshold), apply relativistic visual effects to the star (Doppler shift).
    if (speed >= lightSpeedThreshold) {
      this.applyRelativisticEffects(speed, lightSpeedThreshold, maxSpeed);
    }
  }

  applyRelativisticEffects(speed, lightSpeedThreshold, maxSpeed) {
    // Compute deepness into relativistic speed by normalizing between the threshold and max speed.
    const velocityRatio = (speed - lightSpeedThreshold) / (maxSpeed - lightSpeedThreshold);

    // At relativistic speeds, visually shift star colors based on relative position.
    // Stars closer to center (low z) give blue-ish hue, others appear reddish and dimmer.
    // Simulate Doppler shift effect: blue-shift for stars "ahead", red-shift for "behind".
    if (speed >= lightSpeedThreshold) {
      if (this.z < this.canvas.width / 2) {
        const blueIntensity = 255 - Math.floor(velocityRatio * 255); // Blue shift
        this.color = `rgb(${blueIntensity}, ${blueIntensity}, 255)`;
      } else {
        const redIntensity = Math.min(255, 50 + Math.floor(velocityRatio * 400));
        const dimFactor = 1 - velocityRatio * 0.95;
        this.color = `rgba(255, ${redIntensity}, ${redIntensity}, ${dimFactor})`; // Red shift
      }
    }

    // Speed increase beyond threshold, apply a "cone of vision" effect.
    // Narrow star positions toward center, simulate relativistic directional distortion.
    if (speed >= lightSpeedThreshold) {
      const coneFactor = 1 - ((speed - lightSpeedThreshold) / (maxSpeed - lightSpeedThreshold)) * 0.8;
      this.x *= coneFactor;
      this.y *= coneFactor;
    }
  }

  draw() {
    // Convert star's 3D position (x, y, z) into a 2D screen position.
    // Closer stars (lower z), farther away from center it will appear.
    const sx = (this.x / this.z) * this.canvas.width / 2 + this.canvas.width / 2;
    const sy = (this.y / this.z) * this.canvas.height / 2 + this.canvas.height / 2;

    const prevSx = (this.x / this.prevZ) * this.canvas.width / 2 + this.canvas.width / 2;
    const prevSy = (this.y / this.prevZ) * this.canvas.height / 2 + this.canvas.height / 2;

    // Draw line from star's previous position to its current position.
    // Give illusion of motion streaks, especially at higher speeds.
    this.ctx.beginPath();
    this.ctx.moveTo(prevSx, prevSy);
    this.ctx.lineTo(sx, sy);
    this.ctx.strokeStyle = this.color; // Apply star color
    this.ctx.lineWidth = 1; // Set line thickness
    this.ctx.globalAlpha = this.alpha; // Apply transparency
    this.ctx.stroke(); // Render motion trail
  }

  getRandomStarColor() {
    // Randomly pick a color to diversify star area appearance for different star temperatures.
    const colors = ['#FFFFFF', '#FFD700', '#FF4500', '#87CEFA'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

export function initializeStars(canvas, ctx, numStars) {
  // Create and return array of Star instances to populate star area.
  // NOTE: Number of stars can be adjusted.
  const stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push(new Star(canvas, ctx)); // Push new star instance into array
  }
  return stars; // Return populated star array
}
