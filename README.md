# Agora Token Server

A Node.js server for generating Agora tokens for voice/video calling authentication.

## Deployment Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PM2 (for process management)

### Local Development Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
AGORA_APP_ID=your_app_id_here
AGORA_APP_CERTIFICATE=your_app_certificate_here
PORT=3001
```

3. Start the development server:
```bash
npm run dev
```

### Production Deployment

1. Install PM2 globally:
```bash
npm install -g pm2
```

2. Set up environment variables:
```bash
# Linux/Mac
export AGORA_APP_ID=your_app_id_here
export AGORA_APP_CERTIFICATE=your_app_certificate_here
export PORT=3001

# Windows
set AGORA_APP_ID=your_app_id_here
set AGORA_APP_CERTIFICATE=your_app_certificate_here
set PORT=3001
```

3. Start the server with PM2:
```bash
pm2 start ecosystem.config.js
```

4. Other PM2 commands:
```bash
# View logs
pm2 logs agora-token-server

# Monitor
pm2 monit

# Restart
pm2 restart agora-token-server

# Stop
pm2 stop agora-token-server
```

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t agora-token-server .
```

2. Run the container:
```bash
docker run -d \
  -p 3001:3001 \
  -e AGORA_APP_ID=your_app_id_here \
  -e AGORA_APP_CERTIFICATE=your_app_certificate_here \
  -e PORT=3001 \
  --name agora-token-server \
  agora-token-server
```

## API Endpoints

### Generate Token
- **URL**: `/token`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "channelName": "channel_name_test",
    "uid": "12345678",
    "tokenExpireTs": 3600,
    "privilegeExpireTs": 3600,
    "serviceRtc": {
      "enable": true,
      "role": 1
    }
  }
  ```

### Health Check
- **URL**: `/health`
- **Method**: `GET`

## Security Notes

1. Keep your Agora App ID and App Certificate secure
2. Use HTTPS in production
3. Implement rate limiting
4. Set up proper CORS policies
5. Use environment variables for sensitive data

## Monitoring

The server includes basic health check endpoint for monitoring. For production, consider:
1. Setting up proper logging
2. Implementing monitoring with tools like New Relic or Datadog
3. Setting up alerts for errors
4. Monitoring token generation rates

## License

MIT