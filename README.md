# 3D Animated Kids' Nursery Rhyme – Let's Move and Dance!

A professional, high-quality 3D animated musical video application and video generation studio for toddlers and preschool children (ages 1–5), inspired by cheerful educational nursery-rhyme animations like Cocomelon, Little Baby Bum, and Super Simple Songs.

---

## 🌟 Features

- **Procedural 3D Characters**:
  - **Leo (Toddler Boy)**: Fluffy dark hair, big brown eyes, blue overalls with yellow buttons, and colorful red sneakers.
  - **Lily (Little Girl)**: Golden blonde pigtails with pink ribbons, rainbow-striped shirt, purple shorts, and pink shoes.
  - **Baby Pip (Adorable Baby)**: Curly bright orange hair tuft, oversized sparkling blue eyes, chubby cheeks, turquoise romper with duck badge, and tiny yellow booties.
  - **Mom (Dance Teacher)**: Pastel yellow outfit, styled wavy hair, demonstrating dance movements to the children.
- **Full Kinematics Rig**:
  - Walking (rhythmic knee lift and arm pump)
  - Bunny hopping (springy bouncing arc)
  - Running in place (exaggerated cartoon lean and wind speed)
  - Tiptoeing (elevated delicate steps)
  - Skipping (bouncy step-hops)
  - Jumping (deep squat anticipation & explosive leap)
  - Freeze statue poses (funny humorous freeze frames)
  - Train dance (follow-the-leader circular march)
  - Grand finale celebration (victory arms, confetti, and spins)
- **Playground Environment**:
  - Lush green grass with daisy and clover details
  - Large pink circular dancing mat with stars and pastel concentric rings
  - Pastel-colored cottage house (lavender walls, mint green pitched roof, chimney, round windows)
  - White picket fence bordering the yard
  - Stylized rounded puffy cartoon trees and flowering bushes
  - Playground slide (yellow chute, red ladder, turquoise handrails)
  - Floating iridescent soap bubbles with physics wobble
- **Web Audio API Nursery Synthesizer**:
  - Plucked ukulele chord progression (C - G - Am - F)
  - Bright glockenspiel / xylophone melodic hooks
  - Cheerful percussion (kick, woodblocks, hand claps, shakers)
  - Interactive SFX (boing, giggle, freeze crash, chime)
  - Voice instructions using browser SpeechSynthesis
- **AI Video Generation (`gemini-omni-1.1-flash`)**:
  - Integrated with Google GenAI Interactions API
  - Supports 16:9 Landscape (YouTube/TV) and 9:16 Portrait (Shorts/TikTok/Reels)
  - 5s and 10s video clip generation with character consistency enforcement
  - Built-in video player and download button

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 3. Run the Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your web browser.

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
├── server.ts                    # Full-stack Express server + Gemini Omni Flash endpoints
├── index.html                   # HTML entry point with metadata
├── vite.config.ts               # Vite configuration with Tailwind CSS plugin
├── tsconfig.json                # TypeScript configuration
├── src/
│   ├── main.tsx                 # React DOM root
│   ├── App.tsx                  # Main orchestration component
│   ├── index.css                # Global Tailwind CSS styles
│   ├── types/
│   │   └── nursery.ts           # Type definitions (DanceMove, SceneDefinition, CameraMode)
│   ├── data/
│   │   └── scenesData.ts        # 7 Scenes data, lyrics, choreography, and video prompts
│   ├── audio/
│   │   └── nurseryAudioEngine.ts# Web Audio API nursery rhyme synthesizer
│   ├── three/
│   │   ├── characterFactory.ts  # Procedural 3D cartoon characters (Leo, Lily, Baby Pip, Mom)
│   │   ├── environmentFactory.ts# Backyard playground, slide, cottage, bubbles, dancing mat
│   │   └── cameraDirector.ts    # Smooth camera cuts and director tracking
│   └── components/
│       ├── ThreeCanvas.tsx       # Three.js canvas lifecycle and raycaster interaction
│       ├── CinemaBottomDock.tsx # Collapsible unified control dock
│       ├── KaraokeLyricBar.tsx  # Lyrics display and movement instruction bar
│       ├── TopHeader.tsx        # Branding, scene status, video studio, download triggers
│       ├── DownloadModal.tsx    # Download project zip and assets modal
│       └── VideoStudioModal.tsx # Gemini Omni Flash video generation studio
```

---

## 📄 License

MIT License. Designed and crafted for preschool education and creative animation.
