🛠 Prerequisites

Node.js — Required to run the app
📦 How to Install Node.js
Choose one of the following methods based on your operating system:

🔵 Windows / macOS

Visit the official Node.js  [download page](https://nodejs.org/)
Download the LTS version (Recommended for most users).
Run the installer and follow the setup instructions.
After installation, verify it with:
node -v
npm -v
🐧 Linux (Debian/Ubuntu)

Run these commands in your terminal:

sudo apt update
sudo apt install nodejs npm
node -v
npm -v
💡 You can also use Node Version Manager (nvm) for easier version control: nvm-sh/nvm on GitHub
🧪 Getting Started (Run Locally)

Follow these steps to launch the app in your development environment:

Install dependencies
npm install
Set your API key
Create or edit a file named .env.local in the project root and add your Gemini API key:
GEMINI_API_KEY=your-gemini-api-key-here
Start the development server
npm run dev
The app will typically be available at http://localhost:3000
Let me know if you’d like to include instructions for deployment (e.g. Netlify, Vercel) or Docker support!
