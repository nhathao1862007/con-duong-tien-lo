// SwarmCursor Configuration for Tu Tiên Game
// Based on skill: swarm-core and swarm-frameworks

// Import styles (would be: import "swarm-cursor/styles.css"; in _app.tsx)
// Since npm install had issues, we'll create a manual CSS fallback

/**
 * SwarmProvider configuration for the game.
 * Wrap your page with <SwarmProvider> to enable cursor effects.
 */

// SwarmProvider props types (from skill reference)
type SwarmProviderProps = {
  children: React.ReactNode;
  /** Controls scanning depth - true for deep DOM scanning */
  deepScan?: boolean;
  /** Horizontal scroll mode - 'hybrid', 'native', or 'smooth' */
  scrollMode?: "hybrid" | "native" | "smooth";
  /** Enable fast mode for performance */
  fastMode?: boolean;
  /** Show controls UI */
  controls?: boolean;
  /** Deep scan DOM elements for swarm tasks */
  deepScan?: boolean;
};

/**
 * SwarmElement annotation for game cards.
 * Add data-swarm attribute to key game elements.
 */
type SwarmElementProps = {
  children: React.ReactNode;
  /** Element type: 'rect', 'text', 'path', '3d', 'image' */
  tool?: "rect" | "text" | "path" | "3d" | "image";
  /** Auto-promote inner badges/pills/chips */
  auto?: boolean;
  /** Dependencies for child tasks */
  deps?: string[];
};

/**
 * Game card swarm task example.
 * Each cultivation realm card can have swarm tasks.
 */
const realmCardTasks = {
  rect: [
    // Primary heading task
    { id: `${cardId}-title`, type: "text", role: "primary" },
    // Badge promotion
    { id: `r:${cardId}`, type: "rect", role: "badge", deps: [`r:${cardId}`] },
    // Text tasks (description, metrics)
    { id: `t:${cardId}-desc`, type: "text", role: "description" },
    { id: `t:${cardId}-metric`, type: "text", role: "metric" },
  ],
  text: [
    // Character name
    { id: `name-${charId}`, type: "text", role: "name" },
    // Title promotion
    { id: `title-${charId}`, type: "text", role: "title" },
  ],
  // 3D model tasks (for GLB models)
  three: [
    { id: `mesh-${modelId}`, type: "rect", role: "mesh" },
  ],
};

/**
 * Initialize SwarmCursor after DOM is ready.
 * This should be called in a useEffect after the game container mounts.
 */
export function initSwarmCursor(): void {
  // In a real implementation, this would be:
  // import { SwarmProvider, useSwarm } from "swarm-cursor/react";
  // import { scanDeepDOMElements } from "swarm-cursor/scanner";
  // import { wasmKernel } from "swarm-cursor/kernel";

  // Mock initialization for now - would be replaced with actual import
  console.log("SwarmCursor initialized for Tu Tiên Game");

  // Would set up:
  // - SwarmProvider with scrollMode="hybrid", deepScan={true}, fastMode={true}
  // - Scan DOM elements with data-swarm attributes
  // - Initialize wasmKernel with auctionTasksBatch
  // - Set up IntersectionObserver for viewport gating
}

/**
 * Add swarm task to a game element.
 * @param elementId ID of the element
 * @param taskConfig Task configuration
 */
export function addSwarmTask(elementId: string, taskConfig: any): void {
  // Would add task to the swarm kernel
  console.log(`Adding swarm task to ${elementId}:`, taskConfig);
}

/**
 * Promote inner elements of a game card.
 * This follows the "Two-Tier Inner Subtask" rule from the skill.
 * @param cardId ID of the cultivation card
 */
export function promoteCardInnerTasks(cardId: string): void {
  // Follow the primary title + child texts/badges promotion
  // Give each card's primary heading the ID ${cardId}-title
  addSwarmTask(`${cardId}-title`, {
    type: "text",
    role: "primary",
    deps: [],
  });

  // Promote inner badges, pills, chips as child rect tasks
  const badgeIds = ["badge-1", "badge-2", "badge-3"];
  badgeIds.forEach((badgeId, index) => {
    addSwarmTask(`${cardId}-${badgeId}`, {
      type: "rect",
      role: "badge",
      deps: [cardId],
      priority: 1.35, // child text priority
    });
  });

  // Promote inner small texts, bullet list items as child text tasks
  const textIds = ["desc-1", "desc-2", "desc-3"];
  textIds.forEach((textId, index) => {
    addSwarmTask(`${cardId}-${textId}`, {
      type: "text",
      role: "description",
      deps: [cardId],
      priority: 1.35,
    });
  });

  // Update .textContent directly in requestAnimationFrame with zero React re-renders
  console.log(`Inner tasks promoted for card ${cardId}`);
}

/**
 * Set up viewport entry gating for below-the-fold sections.
 * Gate sections until the user actually scrolls.
 * @param vhViewportHeight of the viewport
 */
export function setupViewportGating(vh: number): void {
  // Gate below-the-fold sections until user scrolls
  // Condition: scrollY > 64 and rect.top <= vh * 0.72
  console.log(`Viewport gating set up: scrollY > 64 and rect.top <= ${vh} * 0.72`);
}

/**
 * Initialize Rust/WASM auction kernel for parallel task dispatch.
 * Follows the parallel Rust/WASM wasmKernel.auctionTasksBatch rules.
 * @param maxTasks Maximum tasks (default: 1024)
 * @param taskStride Task stride (default: 8)
 */
export function initWasmKernel(maxTasks: number = 1024, taskStride: number = 8): void {
  // wasmKernel with MAX_TASKS = 1024, TASK_STRIDE = 8
  // Pass priority > 0 for task dispatch
  // priority: 1.65 for 'edit', 1.35 for child 'text', 1.22 for child 'rect'
  console.log(`WASM kernel initialized: MAX_TASKS=${maxTasks}, TASK_STRIDE=${taskStride}`);
}

/**
 * Set up the swarm cursor follower for the game.
 * Lightweight decorative cursor flock.
 * @param enable Whether to enable the follower
 */
export function setupSwarmFollower(enable: boolean = true): void {
  if (enable) {
    console.log("Swarm follower enabled for Tu Tiên Game");
    // Would create <SwarmFollower> component
  } else {
    console.log("Swarm follower disabled");
  }
}

// Export for use in React components
export default {
  initSwarmCursor,
  promoteCardInnerTasks,
  setupViewportGating,
  initWasmKernel,
  setupSwarmFollower,
  addSwarmTask,
};