import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';

dotenv.config();

import emailRouter from './api/send-email.js';
import receiveEmailRouter from './api/receive-email.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api', emailRouter);
app.use('/api', receiveEmailRouter);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

server.listen(PORT, async () => {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`✓ Backend running at http://localhost:${PORT}`);
    console.log(`${'='.repeat(70)}\n`);

    // Fetch ngrok URL after server starts
    setTimeout(async () => {
        try {
            const res = await fetch('http://localhost:4040/api/tunnels');
            const data = await res.json();
            const tunnel = data.tunnels?.find(t => t.proto === 'https');

            if (tunnel) {
                const ngrokUrl = tunnel.public_url;
                console.log(`\n🌐 NGROK PUBLIC URL: ${ngrokUrl}`);
                console.log(`\n📋 Add this to Resend Webhooks:`);
                console.log(`   URL: ${ngrokUrl}/api/receive-email\n`);
            }
        } catch (err) {
            console.log('⚠️  ngrok API not available (tunnel may not be running)');
        }
    }, 1000);

    console.log('📧 Email endpoints:');
    console.log(`   POST ${process.env.VITE_API_EXTERNAL_URL || `http://localhost:${PORT}`}/api/send-email`);
    console.log(`   POST ${process.env.VITE_API_EXTERNAL_URL || `http://localhost:${PORT}`}/api/receive-email`);
    console.log(`   GET  ${process.env.VITE_API_EXTERNAL_URL || `http://localhost:${PORT}`}/api/list-emails`);
    console.log(`   GET  ${process.env.VITE_API_EXTERNAL_URL || `http://localhost:${PORT}`}/health\n`);
});