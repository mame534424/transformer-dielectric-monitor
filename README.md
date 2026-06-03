# Transformer Frontend (Teacher Guide)

This folder is the visual dashboard.
It lets you:

- Enter transformer test values with sliders
- Run AI health prediction
- Open AI chat for explanation/help

follow these steps exactly.

## What you need first

- Node.js installed (recommended: version 18 or newer)
- Backend running from the backend folder

## Step 1: Open this folder in Terminal

Open VS Code Terminal and run:

```bash
cd C:/Users/user/Music/transformer_health_monitor/transformer-dielectric-monitor
```

## Step 2: Install app packages (first time only)

```bash
npm install
```

Wait until installation finishes.

## Step 3: Connect frontend to backend

Create a file named `.env.local` in this folder.

Add this line:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

If your backend is running on a different port, change `8000`.

## Step 4: Start the frontend

```bash
npm run dev
```

Keep this terminal open while using the app.

Open in browser:

- `http://localhost:3000`

## How teachers use it

1. Start backend server first (see backend README).
2. Start frontend server (Step 4 above).
3. Open `http://localhost:3000`.
4. Move slider values to match transformer test data.
5. Click analyze/predict to see transformer condition.
6. Open chat page to ask questions like:
   - "Explain this result in simple words"
   - "What maintenance should we do next?"

## Daily use (after first setup)

Each day:

1. Start backend terminal
2. Start frontend terminal
3. Open `http://localhost:3000`

You do not need `npm install` again unless packages changed.

## If something goes wrong

### Browser page does not open

- Check frontend terminal is running
- Check URL is exactly `http://localhost:3000`

### "Backend unreachable" or no prediction

- Make sure backend terminal is running
- Check `.env.local` has correct backend URL
- Restart frontend after editing `.env.local`

### Port 3000 already in use

Next.js may ask to use another port (example: 3001).
If yes, open the shown URL in the browser.

## Downloading on another computer (simple way)

1. Download project ZIP from GitHub (Code -> Download ZIP).
2. Extract ZIP.
3. Open extracted folder in VS Code.
4. Follow backend README first, then this frontend README.
