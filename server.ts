import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { execSync } from 'child_process';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '50mb' }));

// In-memory job store for async video generation
interface VideoJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoData?: string;
  videoUri?: string;
  mimeType?: string;
  error?: string;
  createdAt: number;
  prompt: string;
  sceneTitle: string;
  aspectRatio: string;
}

const videoJobs = new Map<string, VideoJob>();

// Helper to get GoogleGenAI client
function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured. Please set your Gemini API key.');
  }
  return new GoogleGenAI({ apiKey });
}

// Check API key configuration status
app.get('/api/status', (req, res) => {
  res.json({
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-omni-1.1-flash',
    supportedAspectRatios: ['16:9', '9:16'],
    supportedDurations: ['5s', '10s'],
  });
});

// Download full project source zip archive
app.get('/api/download-project', (req, res) => {
  const zipPath = path.resolve(__dirname, 'public', 'lets-move-and-dance-3d-project.zip');

  try {
    const pythonScript = [
      'import os, zipfile',
      "output_zip = 'public/lets-move-and-dance-3d-project.zip'",
      "os.makedirs('public', exist_ok=True)",
      "exclude_dirs = {'node_modules', 'dist', '.git', '.cache', '__pycache__', '.aistudio'}",
      "exclude_files = {'.DS_Store', 'lets-move-and-dance-3d-project.zip'}",
      "with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:",
      "    for root, dirs, files in os.walk('.'):",
      "        dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.git')]",
      '        for file in files:',
      "            if file in exclude_files or file.endswith('.zip'):",
      '                continue',
      '            filepath = os.path.join(root, file)',
      "            arcname = os.path.relpath(filepath, '.')",
      '            zipf.write(filepath, arcname)',
    ].join('\\n');

    execSync(`python3 -c "${pythonScript}"`);
  } catch (err) {
    console.warn('Could not re-generate zip file, using existing if present:', err);
  }

  if (fs.existsSync(zipPath)) {
    res.setHeader('Content-Disposition', 'attachment; filename="lets-move-and-dance-3d-project.zip"');
    res.setHeader('Content-Type', 'application/zip');
    res.sendFile(zipPath);
  } else {
    res.status(404).json({ error: 'Zip file not found' });
  }
});

// Synchronous video generation endpoint using gemini-omni-1.1-flash
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt, aspectRatio = '16:9', duration = '5s', resolution = '720p', sceneTitle = 'Dance Scene' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGenAIClient();

    console.log(`[Video Generation] Starting generation for: "${sceneTitle}" (${aspectRatio}, ${duration})`);

    const interaction = await ai.interactions.create(
      {
        model: 'gemini-omni-1.1-flash',
        input: prompt,
        background: false,
        store: false,
        stream: false,
        response_format: {
          type: 'video',
          aspect_ratio: aspectRatio === '9:16' ? '9:16' : '16:9',
          duration: duration === '10s' ? '10s' : '5s',
          resolution: resolution || '720p',
        },
      },
      { timeout: 360000 } // 6 minutes timeout for video generation
    );

    const videoPart = interaction.output_video;

    if (videoPart && videoPart.data) {
      const mimeType = videoPart.mime_type || 'video/mp4';
      const videoDataUrl = `data:${mimeType};base64,${videoPart.data}`;
      return res.json({
        success: true,
        videoUrl: videoDataUrl,
        mimeType,
        aspectRatio,
        duration,
        sceneTitle,
      });
    } else if (videoPart && videoPart.uri) {
      return res.json({
        success: true,
        videoUri: videoPart.uri,
        mimeType: videoPart.mime_type || 'video/mp4',
        aspectRatio,
        duration,
        sceneTitle,
      });
    } else {
      // Check if steps contained any other text or errors
      let failureReason = 'Model completed without returning video data';
      if (interaction.steps && interaction.steps.length > 0) {
        for (const step of interaction.steps) {
          if (step.type === 'model_output' && Array.isArray(step.content)) {
            for (const item of step.content) {
              const part = item as any;
              if (part?.type === 'text' && typeof part.text === 'string') {
                failureReason = part.text;
                break;
              }
            }
          }
        }
      }
      return res.status(500).json({ error: failureReason });
    }
  } catch (err: any) {
    console.error('[Video Generation Error]', err);
    const errorMessage = err?.message || 'Failed to generate video with gemini-omni-1.1-flash';
    return res.status(500).json({
      error: errorMessage,
      details: err?.toString(),
    });
  }
});

// Asynchronous background video generation endpoint
app.post('/api/generate-video-async', async (req, res) => {
  try {
    const { prompt, aspectRatio = '16:9', duration = '5s', resolution = '720p', sceneTitle = 'Dance Scene' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGenAIClient();
    const jobId = 'vid_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

    const job: VideoJob = {
      id: jobId,
      status: 'processing',
      createdAt: Date.now(),
      prompt,
      sceneTitle,
      aspectRatio,
    };
    videoJobs.set(jobId, job);

    // Return jobId immediately
    res.json({ jobId, status: 'processing' });

    // Execute in background
    (async () => {
      try {
        const interaction = await ai.interactions.create(
          {
            model: 'gemini-omni-1.1-flash',
            input: prompt,
            background: false,
            store: false,
            stream: false,
            response_format: {
              type: 'video',
              aspect_ratio: aspectRatio === '9:16' ? '9:16' : '16:9',
              duration: duration === '10s' ? '10s' : '5s',
              resolution: resolution || '720p',
            },
          },
          { timeout: 360000 }
        );

        const videoPart = interaction.output_video;
        if (videoPart && videoPart.data) {
          job.status = 'completed';
          job.mimeType = videoPart.mime_type || 'video/mp4';
          job.videoData = `data:${job.mimeType};base64,${videoPart.data}`;
        } else if (videoPart && videoPart.uri) {
          job.status = 'completed';
          job.mimeType = videoPart.mime_type || 'video/mp4';
          job.videoUri = videoPart.uri;
        } else {
          job.status = 'failed';
          job.error = 'No video output returned from model';
        }
      } catch (e: any) {
        job.status = 'failed';
        job.error = e?.message || 'Video generation failed';
        console.error(`[Async Video Job ${jobId} Failed]`, e);
      }
    })();
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Failed to start video generation' });
  }
});

// Polling endpoint for video job status
app.get('/api/video-job/:id', (req, res) => {
  const job = videoJobs.get(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json({
    id: job.id,
    status: job.status,
    videoData: job.videoData,
    videoUri: job.videoUri,
    mimeType: job.mimeType,
    error: job.error,
    sceneTitle: job.sceneTitle,
    aspectRatio: job.aspectRatio,
  });
});

// Vite dev server mounting
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Kids Nursery Rhyme] Server active at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
