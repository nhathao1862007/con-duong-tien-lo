import { gsap } from "gsap";
import { useEffect, useRef } from "react";

// Register core plugins needed for the game
gsap.registerPlugin();

// Breakthrough animation effect
export function playBreakthroughAnimation(
  success: boolean,
  fromRealm: string,
  toRealm?: string
): void {
  const container = document.getElementById("game-container");
  if (!container) return;

  if (success) {
    // Success: golden light burst and realm name flash
    gsap.fromTo(
      "#breakthrough-flash",
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
    );

    // Realm title flash
    gsap.to("#current-realm", {
      opacity: 0,
      duration: 0.3,
      ease: "power1.inOut",
      onComplete: () => {
        gsap.to("#current-realm", { opacity: 1, duration: 0.3 });
        // Update realm text
        if (toRealm) {
          gsap.set("#current-realm", { text: `Đột phá lên ${toRealm}` });
          gsap.fromTo("#current-realm", { opacity: 0 }, { opacity: 1, duration: 0.3 });
        }
      }
    });

    // Staggered particle explosion with color variation
    const particleColors = [
      "#4E9F3D",
      "#D4AF37",
      "#C6A0FF",
      "#FF5F5F",
      "#7ED321",
    ];
    for (let i = 0; i < 40; i++) {
      const particle = document.createElement("div");
      particle.className = "breakthrough-particle";
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      particle.style.cssText = `
        position: absolute;
        width: 5px;
        height: 5px;
        background: ${color};
        left: calc(50% + ${Math.random() * 300 - 150}px);
        top: calc(50% + ${Math.random() * 300 - 150}px);
        border-radius: 50%;
        pointer-events: none;
        box-shadow: 0 0 8px ${color};
      `;
      container.appendChild(particle);
      const index = i;
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 500,
        y: (Math.random() - 0.5) * 500,
        opacity: 0,
        duration: Math.random() * 2 + 0.5,
        ease: "power2.out",
        delay: index * 0.03,
        onComplete: () => particle.remove(),
      });
    }

    // Realm indicator pulse
    gsap.fromTo(
      "#realm-indicator",
      { scale: 1, opacity: 1 },
      { scale: 1.3, opacity: 0.8, duration: 0.4, yoyo: true, repeat: 1, ease: "power1.inOut" }
    );

    // Gold counter pulse
    gsap.fromTo(
      "#gold-counter",
      { scale: 1, x: 0 },
      { scale: 1.25, x: -10, duration: 0.4, yoyo: true, repeat: 1, ease: "back.out(1.7)" }
    );

    // Celebration burst from center
    for (let i = 0; i < 12; i++) {
      const segment = document.createElement("div");
      segment.className = "breakthrough-segment";
      segment.style.cssText = `
        position: absolute;
        width: 3px;
        height: 3px;
        background: #4E9F3D;
        left: calc(50% + ${Math.cos((i / 12) * Math.PI * 2) * 20}px);
        top: calc(50% + ${Math.sin((i / 12) * Math.PI * 2) * 20}px);
        border-radius: 50%;
        pointer-events: none;
      `;
      container.appendChild(segment);
      gsap.fromTo(
        segment,
        { opacity: 0, width: "3px" },
        { opacity: 1, width: "12px", duration: 0.5, ease: "power2.out", delay: i * 0.05, onComplete: () => {
          gsap.to(segment, { opacity: 0, duration: 0.3, delay: 1.5, onComplete: () => segment.remove() });
        }}
      );
    }
  } else {
    // Failed: red shockwave and particle effect
    // Create shockwave overlay
    const shockwave = document.createElement("div");
    shockwave.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      background: radial-gradient(circle, rgba(208, 2, 27, 0.3) 0%, transparent 70%);
      z-index: 999;
    `;
    container.appendChild(shockwave);
    gsap.fromTo(
      shockwave,
      { opacity: 1, transform: "scale(0)" },
      { opacity: 0, transform: "scale(1.5)", duration: 0.5, ease: "power1.out", onComplete: () => shockwave.remove() }
    );

    // Screen shake with multiple intensity levels
    const shakeSequence = [
      { x: -15, rotate: -8, duration: 0.2 },
      { x: 15, rotate: 8, duration: 0.2 },
      { x: -10, rotate: -5, duration: 0.15 },
      { x: 10, rotate: 5, duration: 0.15 },
      { x: -6, rotate: -3, duration: 0.1 },
      { x: 6, rotate: 3, duration: 0.1 },
      { x: -3, rotate: -1, duration: 0.05 },
      { x: 3, rotate: 1, duration: 0.05 },
      { x: 0, rotate: 0, duration: 0.1 },
    ];
    let currentTime = 0;
    shakeSequence.forEach((shake, index) => {
      gsap.delayedCall(currentTime, () => {
        gsap.to(container, { ...shake, ease: "power1.inOut" });
      });
      currentTime += 0.08;
    });

    // Red flash overlay
    const redOverlay = document.createElement("div");
    redOverlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(220, 53, 69, 0.3);
      pointer-events: none;
      z-index: 1000;
    `;
    container.appendChild(redOverlay);
    gsap.fromTo(
      redOverlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.1, ease: "power1.in", onComplete: () => {
        gsap.to(redOverlay, { opacity: 0, duration: 0.4, ease: "power1.out", delay: 0.3, onComplete: () => redOverlay.remove() });
      }}
    );

    // Damaged particles with physics-based motion
    const particleColors = ["#D0021B", "#8B0000", "#FF6B6B", "#E74C3C"];
    for (let i = 0; i < 25; i++) {
      const particle = document.createElement("div");
      particle.className = "breakthrough-particle";
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: ${color};
        left: calc(50% + ${Math.random() * 250 - 125}px);
        top: calc(50% + ${Math.random() * 250 - 125}px);
        border-radius: 50%;
        pointer-events: none;
      `;
      container.appendChild(particle);
      // Random direction with gravity-like fall
      const angle = Math.random() * Math.PI * 2;
      const velocity = 50 + Math.random() * 50;
      const gravity = 200; // pixels per second squared
      const life = 0.5 + Math.random() * 0.5;
      
      gsap.to(particle, {
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity + gravity * life * 0.5,
        opacity: 0,
        duration: life,
        ease: "power1.out",
        onComplete: () => particle.remove(),
      });
    }

    // Damaged realm indicator pulse
    gsap.fromTo(
      "#realm-indicator",
      { scale: 1 },
      { scale: 0.8, rotation: -5, duration: 0.3, yoyo: true, repeat: 1, ease: "power1.inOut" }
    );
  }
}

// Meditation time visualization
export function playMeditationAnimation(seconds: number): void {
  const meditationBar = document.getElementById("meditation-bar");
  if (!meditationBar) return;

  // Animate bar fill based on meditation duration
  const maxSeconds = 600; // 10 minutes max visualization
  const progress = Math.min(seconds / maxSeconds, 1);

  gsap.to(meditationBar, {
    width: `${progress * 100}%`,
    duration: Math.max(seconds / 1000, 0.5), // minimum 0.5s animation
    ease: "power1.inOut",
    onComplete: () => {
      // Reset after animation
      gsap.set(meditationBar, { width: "0%" });
    }
  });

  // Pulse effect while meditating
  gsap.to(meditationBar, {
    boxShadow: `0 0 25px rgba(78, 159, 61, 0.5)`,
    duration: 0.8,
    ease: "power1.inOut",
    yoyo: true,
    repeat: Infinity,
    delay: 1,
  });

  // Optional: glow pulse around the bar
  gsap.to(meditationBar, {
    width: `${(progress + 0.1) * 100}%`,
    duration: 0.3,
    ease: "power1.inOut",
    yoyo: true,
    repeat: Infinity,
    direction: "alternate",
    delay: 2,
  });
}

// Level up animation
export function playLevelUpAnimation(newLevel: number, expGained: number): void {
  const levelUpContainer = document.getElementById("level-up-popup");
  if (!levelUpContainer) return;

  gsap.set(levelUpContainer, { display: "flex" });
  gsap.fromTo(
    levelUpContainer,
    { opacity: 0, y: -60, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
  );

  // Show level and exp
  gsap.set("#level-up-text", { text: `Cấp lên ${newLevel}\nThu được +${expGained} tu vi` });

  // Count up animation for exp with easing
  const expDisplay = document.getElementById("gained-exp");
  if (expDisplay) {
    let current = 0;
    const endValue = expGained;
    const duration = Math.max(expGained / 50, 1); // smoother count up
    const startTime = Date.now();

    const animateExp = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // Easing function: ease-out quadratic
      const easedProgress = 1 - Math.pow(1 - progress, 2);
      current = Math.floor(endValue * easedProgress);
      gsap.set(expDisplay, { text: current });

      if (progress < 1) {
        requestAnimationFrame(animateExp);
      } else {
        gsap.set(expDisplay, { text: endValue });
      }
    };

    requestAnimationFrame(animateExp);
  }

  // Auto-hide after 2.5 seconds with fade out
  gsap.delayedCall(2.5, () => {
    gsap.to(levelUpContainer, {
      opacity: 0,
      y: 60,
      scale: 0.95,
      duration: 0.4,
      ease: "power1.in",
      onComplete: () => gsap.set(levelUpContainer, { display: "none" }),
    });
  });
}

// Shop pop-up animation with category tabs
export function playShopAnimation(open: boolean, category?: string): void {
  const shopPopup = document.getElementById("shop-popup");
  if (!shopPopup) return;

  if (open) {
    gsap.set(shopPopup, { display: "block" });
    gsap.fromTo(
      shopPopup,
      { opacity: 0, scale: 0.85, y: -30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
    );

    // If category specified, highlight it
    if (category) {
      const tab = document.querySelector(`[data-shop-tab="${category}"]`);
      if (tab) {
        gsap.fromTo(
          tab,
          { scale: 0.8, y: 10 },
          { scale: 1, y: 0, duration: 0.3, ease: "back.out(1.3)" }
        );
      }
    }
  } else {
    gsap.to(shopPopup, {
      opacity: 0,
      scale: 0.85,
      y: -30,
      duration: 0.4,
      ease: "power1.in",
      onComplete: () => gsap.set(shopPopup, { display: "none" }),
    });
  }
}

// Initialize GSAP when component mounts
export function initGameAnimations(): void {
  // Create breakthrough flash element if not exists
  if (!document.getElementById("breakthrough-flash")) {
    const flash = document.createElement("div");
    flash.id = "breakthrough-flash";
    flash.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      background: radial-gradient(circle, rgba(78,159,61,0.2) 0%, transparent 70%);
    `;
    const container = document.getElementById("game-container");
    if (container) container.appendChild(flash);
  }

  // Create meditation bar
  if (!document.getElementById("meditation-bar")) {
    const bar = document.createElement("div");
    bar.id = "meditation-bar";
    bar.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 0%;
      height: 8px;
      background: #4E9F3D;
      border-radius: 4px;
      transition: width 0.3s ease;
      z-index: 100;
    `;
    const container = document.getElementById("game-container");
    if (container) container.appendChild(bar);
  }

  // Create level up popup
  if (!document.getElementById("level-up-popup")) {
    const popup = document.createElement("div");
    popup.id = "level-up-popup";
    popup.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0) translateY(-60px);
      background: #16161a;
      border: 1px solid #4E9F3D;
      padding: 25px;
      border-radius: 10px;
      color: #fff;
      display: none;
      flex-direction: column;
      align-items: center;
      z-index: 200;
      min-width: 250px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    popup.innerHTML = `
      <div id="level-up-text" style="font-size: 20px; margin-bottom: 15px; text-align: center;"></div>
      <div id="gained-exp" style="font-size: 16px; color: #4E9F3D; margin-bottom: 20px; text-align: center;"></div>
    `;
    const container = document.getElementById("game-container");
    if (container) container.appendChild(popup);
  }

  // Create shop popup
  if (!document.getElementById("shop-popup")) {
    const popup = document.createElement("div");
    popup.id = "shop-popup";
    popup.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      background: #16161a;
      border: 2px solid #4E9F3D;
      padding: 35px;
      border-radius: 15px;
      color: #fff;
      display: none;
      flex-direction: column;
      align-items: center;
      z-index: 200;
      min-width: 350px;
      box-shadow: 0 0 40px rgba(78,159,61,0.3);
    `;
    popup.innerHTML = `
      <h3 style="margin: 0 0 25px 0; color: #4E9F3D;">Cửa Hàng</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 100%; margin-bottom: 25px;">
        <!-- Shop items will be populated -->
      </div>
      <div style="display: flex; justify-content: center; gap: 15px;">
        <button style="background: #4E9F3D; color: #0f0f11; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500;">Mua</button>
        <button style="background: transparent; color: #aaa; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500;">Hủy</button>
      </div>
    `;
    const container = document.getElementById("game-container");
    if (container) container.appendChild(popup);
  }
}

export default initGameAnimations;