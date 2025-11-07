# Conway's Game of Life - Implementation Plan

## Project Overview

Build an interactive Conway's Game of Life simulator with an infinite canvas, intuitive controls, and classic patterns. Dark mode only.

## Technical Stack

- **Framework**: TanStack Start + React 19
- **UI Components**: shadcn/ui (New York style)
- **Rendering**: HTML Canvas API
- **Styling**: Tailwind CSS 4.x (dark mode only)
- **Icons**: Lucide React
- **Language**: TypeScript (strict mode)

## Core Features

- ✅ Infinite scrollable canvas
- ✅ Left-click & drag to draw alive cells
- ✅ Right-click & drag to pan the viewport
- ✅ Start/Stop simulation control
- ✅ Speed control slider (1-60 generations/second)
- ✅ Generation counter & alive cells stats
- ✅ Clear board button
- ✅ Preset classic patterns (glider, blinker, spaceship, etc.)

---

## File Structure

```
src/
├── components/
│   ├── ui/                          # shadcn/ui components
│   │   ├── button.tsx               # ✅ Already exists
│   │   ├── slider.tsx               # 📦 Add via shadcn CLI
│   │   ├── card.tsx                 # 📦 Add via shadcn CLI
│   │   ├── select.tsx               # 📦 Add via shadcn CLI
│   │   └── separator.tsx            # 📦 Add via shadcn CLI
│   │
│   └── game/                        # Game-specific components
│       ├── Canvas.tsx               # Main canvas component with rendering
│       ├── ControlPanel.tsx         # Top control bar (start/stop, speed, clear)
│       ├── Stats.tsx                # Generation counter & cell count display
│       └── PatternSelector.tsx      # Dropdown for preset patterns
│
├── lib/
│   ├── utils.ts                     # ✅ Existing (cn helper)
│   │
│   ├── game/                        # Core game logic
│   │   ├── GameEngine.ts            # Conway's rules & simulation loop
│   │   ├── Grid.ts                  # Sparse grid data structure (Set/Map based)
│   │   ├── patterns.ts              # Preset patterns definitions
│   │   └── types.ts                 # TypeScript interfaces (Cell, Pattern, etc.)
│   │
│   └── canvas/                      # Canvas rendering utilities
│       ├── Camera.ts                # Viewport/pan/zoom system
│       └── renderer.ts              # Canvas drawing utilities
│
├── hooks/                           # Custom React hooks
│   ├── useGameLoop.ts               # requestAnimationFrame-based game loop
│   ├── useCanvas.ts                 # Canvas setup & resize handling
│   └── useMouseInteraction.ts      # Mouse events (draw, pan, etc.)
│
├── routes/
│   ├── __root.tsx                   # ✅ Existing root layout
│   └── index.tsx                    # Main game page (updated)
│
└── styles.css                       # ✅ Existing global styles
```

---

## Implementation Phases

### **Phase 1: Foundation & UI Components**

**Goal**: Set up the UI shell with shadcn components and control panel layout

**Tasks**:

1. Add required shadcn/ui components: `slider`, `card`, `select`, `separator`
2. Create `ControlPanel.tsx` component with placeholder buttons
3. Create `Stats.tsx` component for generation/cell count display
4. Update `routes/index.tsx` to render the game layout structure
5. Ensure dark mode is enforced (remove light mode CSS variables if present)

**Deliverable**: Static UI with control panel, stats display, and canvas placeholder

**Files Created**:

- `src/components/ui/slider.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/separator.tsx`
- `src/components/game/ControlPanel.tsx`
- `src/components/game/Stats.tsx`

**Files Modified**:

- `src/routes/index.tsx`

---

### **Phase 2: Canvas Setup & Rendering System**

**Goal**: Implement canvas rendering with viewport/camera system

**Tasks**:

1. Create `types.ts` with interfaces (Cell, CameraState, GridState)
2. Create `Camera.ts` class for viewport transformations
3. Create `renderer.ts` with canvas drawing utilities
4. Create `useCanvas.ts` hook for canvas setup and resize handling
5. Create `Canvas.tsx` component with basic grid rendering
6. Implement world-to-screen coordinate transformations

**Deliverable**: Working canvas with visible grid that can render cells

**Files Created**:

- `src/lib/game/types.ts`
- `src/lib/canvas/Camera.ts`
- `src/lib/canvas/renderer.ts`
- `src/hooks/useCanvas.ts`
- `src/components/game/Canvas.tsx`

---

### **Phase 3: User Interaction (Drawing & Panning)**

**Goal**: Implement mouse controls for drawing cells and panning

**Tasks**:

1. Create `Grid.ts` sparse grid data structure (Set-based for infinite board)
2. Create `useMouseInteraction.ts` hook for mouse event handling
3. Implement left-click drawing (add alive cells)
4. Implement left-click drag drawing (continuous drawing)
5. Implement right-click panning (move viewport)
6. Connect mouse interactions to canvas rendering

**Deliverable**: Interactive canvas where users can draw cells and pan around

**Files Created**:

- `src/lib/game/Grid.ts`
- `src/hooks/useMouseInteraction.ts`

**Files Modified**:

- `src/components/game/Canvas.tsx`

---

### **Phase 4: Game Logic & Simulation**

**Goal**: Implement Conway's Game of Life rules and simulation loop

**Tasks**:

1. Create `GameEngine.ts` with Conway's rules implementation
2. Implement neighbor counting algorithm (efficient for sparse grid)
3. Implement generation step function (birth/death rules)
4. Create `useGameLoop.ts` hook with requestAnimationFrame
5. Connect game loop to canvas rendering
6. Wire up Start/Stop button to control simulation

**Deliverable**: Working Conway's Game of Life simulation with start/stop control

**Files Created**:

- `src/lib/game/GameEngine.ts`
- `src/hooks/useGameLoop.ts`

**Files Modified**:

- `src/components/game/ControlPanel.tsx`
- `src/components/game/Canvas.tsx`

---

### **Phase 5: Advanced Features**

**Goal**: Add speed control, stats, clear, and preset patterns

**Tasks**:

1. Integrate speed slider to control generations/second
2. Connect Stats component to show generation count and alive cells
3. Implement clear board functionality
4. Create `patterns.ts` with classic patterns (glider, blinker, toad, beacon, pulsar, lightweight spaceship)
5. Create `PatternSelector.tsx` component
6. Implement pattern placement on the grid

**Deliverable**: Full-featured Game of Life with all controls and patterns

**Files Created**:

- `src/lib/game/patterns.ts`
- `src/components/game/PatternSelector.tsx`

**Files Modified**:

- `src/components/game/ControlPanel.tsx`
- `src/components/game/Stats.tsx`
- `src/hooks/useGameLoop.ts`

---

### **Phase 6: Polish & Optimization**

**Goal**: Performance optimization and final polish

**Tasks**:

1. Optimize rendering (only redraw when needed, avoid unnecessary clears)
2. Optimize grid calculations (spatial hashing, boundary tracking)
3. Add smooth camera panning animations (optional)
4. Add visual feedback for drawing (highlight cells on hover)
5. Add keyboard shortcuts (Space: start/stop, C: clear, etc.)
6. Test edge cases (very large patterns, rapid interactions)
7. Performance profiling and improvements

**Deliverable**: Polished, performant Conway's Game of Life ready for use

**Files Modified**:

- All relevant files for optimizations
- Add keyboard event handlers

---

## Technical Decisions

### Why HTML Canvas?

- High performance for rendering thousands of cells
- Easy coordinate transformations for infinite scrolling
- Better control over rendering pipeline
- Smooth animations and interactions

### Why Sparse Grid (Set/Map)?

- Infinite board support without memory overhead
- Only store alive cells
- Fast lookups and updates
- Efficient neighbor counting

### Conway's Rules (Classic)

1. Any live cell with 2-3 neighbors survives
2. Any dead cell with exactly 3 neighbors becomes alive
3. All other cells die or stay dead

### Performance Targets

- 60 FPS rendering at normal speeds
- Support for 10,000+ active cells
- Smooth panning and drawing interactions

---

## Development Workflow

- Run `bun run dev` to start development server (port 3000)
- Run `bun run typecheck` to check types
- Run `bun run lint` to lint code
- No unit tests required (per user request)
