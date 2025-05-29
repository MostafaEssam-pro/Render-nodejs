require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Token generation endpoint
app.post('/token', (req, res) => {
    // Get channel name from request
    const channelName = req.body.channelName;
    if (!channelName) {
        return res.status(400).json({ error: 'Channel name is required' });
    }

    // Get uid from request
    let uid = req.body.uid;
    if (!uid || uid === '') {
        uid = 0;
    }

    // Check if credentials are available
    if (!process.env.AGORA_APP_ID || !process.env.AGORA_APP_CERTIFICATE) {
        console.error('Need to set environment variable AGORA_APP_ID and AGORA_APP_CERTIFICATE');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    // Get token expiration time
    const tokenExpireTs = req.body.tokenExpireTs || 3600;
    const privilegeExpireTs = req.body.privilegeExpireTs || 3600;

    // Get service configuration
    const serviceRtc = req.body.serviceRtc || { enable: true, role: 1 };
    const role = serviceRtc.role === 1 ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    // Calculate timestamps
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + privilegeExpireTs;

    try {
        // Generate Token
        const token = RtcTokenBuilder.buildTokenWithUid(
            process.env.AGORA_APP_ID,
            process.env.AGORA_APP_CERTIFICATE,
            channelName,
            uid,
            role,
            privilegeExpiredTs
        );

        // Return the token with all information
        res.json({
            token: token,
            channelName: channelName,
            uid: uid,
            role: role,
            appId: process.env.AGORA_APP_ID,
            expiration: privilegeExpiredTs,
            serviceRtc: {
                enable: serviceRtc.enable,
                role: serviceRtc.role
            }
        });
    } catch (error) {
        console.error('Token generation error:', error);
        res.status(500).json({
            error: 'Failed to generate token',
            details: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        appId: process.env.AGORA_APP_ID ? 'configured' : 'missing',
        certificate: process.env.AGORA_APP_CERTIFICATE ? 'configured' : 'missing'
    });
});

// Start server
app.listen(port, () => {
    console.log(`Agora token server running on port ${port}`);
    console.log('Environment check:', {
        appId: process.env.AGORA_APP_ID ? 'configured' : 'missing',
        certificate: process.env.AGORA_APP_CERTIFICATE ? 'configured' : 'missing'
    });
});