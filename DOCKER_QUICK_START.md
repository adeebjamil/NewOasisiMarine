# 🐳 Quick Start - Docker Setup

## Step 1: Start Docker Desktop

**IMPORTANT**: You need to start Docker Desktop first!

1. Open **Docker Desktop** from Windows Start menu
2. Wait for Docker to start (you'll see a green icon in system tray)
3. Verify it's running:
   ```powershell
   docker --version
   ```

---

## Step 2: Build and Run

Once Docker Desktop is running:

```powershell
# Navigate to project directory
cd C:\Users\USER\Desktop\lovocard\oasismarine-uae\oasismarine-uae

# Build and start the container
docker-compose up -d --build
```

This will:
- ✅ Build the Docker image
- ✅ Start the container
- ✅ Run in background (detached mode)

---

## Step 3: Check Status

```powershell
# Check if container is running
docker-compose ps

# View logs
docker-compose logs -f
```

---

## Step 4: Access Application

Open your browser:
- **Main URL**: http://localhost:8085
- **Health Check**: http://localhost:8085/api/health

---

## Quick Commands

```powershell
# Stop container
docker-compose stop

# Start container
docker-compose start

# Restart container
docker-compose restart

# Stop and remove
docker-compose down

# View logs
docker-compose logs -f

# Rebuild
docker-compose up -d --build
```

---

## Troubleshooting

### Docker Desktop Not Running
**Error**: `cannot find the file specified`

**Solution**:
1. Open Docker Desktop
2. Wait for it to fully start
3. Try the command again

### Port Already in Use
**Error**: `port is already allocated`

**Solution**:
```powershell
# Stop any running process on port 8085
netstat -ano | findstr :8085
# Kill the process or change port in docker-compose.yaml
```

### Build Fails
**Solution**:
```powershell
# Clean Docker cache
docker system prune -a
# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

---

## Alternative: Run Without Docker

If Docker has issues, run normally:

```powershell
npm run dev
```

Or for production:

```powershell
npm run build
npm start
```

---

## Mobile Access (Docker)

1. Get your IP:
   ```powershell
   ipconfig
   ```

2. Access from mobile:
   ```
   http://YOUR_IP:8085
   ```

3. Allow through firewall:
   ```powershell
   New-NetFirewallRule -DisplayName "Docker Oasis Marine" -Direction Inbound -Protocol TCP -LocalPort 8085 -Action Allow -Profile Private
   ```

---

**Need detailed help?** Check `DOCKER_GUIDE.md`
