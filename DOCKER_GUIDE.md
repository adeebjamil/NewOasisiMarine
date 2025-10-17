# Docker Setup Guide for Oasis Marine UAE

## 🐳 Docker Compose Configuration

This guide will help you run the Oasis Marine application using Docker.

---

## 📋 Prerequisites

1. **Docker Desktop** installed (includes Docker Compose)
   - Windows: https://docs.docker.com/desktop/install/windows-install/
   - Download and install Docker Desktop for Windows

2. **Verify Installation**
   ```powershell
   docker --version
   docker-compose --version
   ```

---

## 🚀 Quick Start

### 1. Build and Start the Application

```powershell
# Build and start in detached mode
docker-compose up -d --build

# Or build first, then start
docker-compose build
docker-compose up -d
```

### 2. Check Status

```powershell
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f oasis-marine-app
```

### 3. Access the Application

- **Main Application**: http://localhost:8085
- **Alternative Port**: http://localhost:3000
- **Health Check**: http://localhost:8085/api/health

---

## 🛠️ Common Commands

### Start/Stop/Restart

```powershell
# Start services
docker-compose start

# Stop services (keeps containers)
docker-compose stop

# Restart services
docker-compose restart

# Stop and remove containers
docker-compose down

# Stop and remove everything (including volumes)
docker-compose down -v
```

### View Logs

```powershell
# All logs
docker-compose logs

# Follow logs (live)
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service logs
docker-compose logs -f oasis-marine-app
```

### Rebuild Application

```powershell
# Rebuild without cache
docker-compose build --no-cache

# Rebuild and restart
docker-compose up -d --build
```

### Execute Commands in Container

```powershell
# Access container shell
docker-compose exec oasis-marine-app sh

# Run npm command
docker-compose exec oasis-marine-app npm run build

# Check Node version
docker-compose exec oasis-marine-app node --version
```

---

## 🔍 Troubleshooting

### Container Won't Start

```powershell
# Check logs for errors
docker-compose logs oasis-marine-app

# Check container status
docker-compose ps

# Remove and rebuild
docker-compose down
docker-compose up -d --build
```

### Port Already in Use

```powershell
# Find what's using port 8085
netstat -ano | findstr :8085

# Change port in docker-compose.yaml
ports:
  - "9000:8085"  # Use different external port
```

### Application Not Accessible

```powershell
# Check if container is running
docker-compose ps

# Check container health
docker inspect oasis-marine-nextjs --format='{{.State.Health.Status}}'

# Check logs for errors
docker-compose logs -f
```

### Database Connection Issues

```powershell
# Check environment variables
docker-compose exec oasis-marine-app printenv | grep DATABASE

# Restart container
docker-compose restart oasis-marine-app
```

### Build Issues

```powershell
# Clear Docker cache and rebuild
docker-compose down
docker system prune -a
docker-compose build --no-cache
docker-compose up -d
```

---

## 📊 Monitoring

### Check Container Stats

```powershell
# Real-time resource usage
docker stats oasis-marine-nextjs

# Container details
docker inspect oasis-marine-nextjs
```

### Health Check Status

```powershell
# Check health
docker inspect oasis-marine-nextjs --format='{{json .State.Health}}' | ConvertFrom-Json

# View health check logs
docker inspect oasis-marine-nextjs --format='{{range .State.Health.Log}}{{.Output}}{{end}}'
```

---

## 🔧 Advanced Configuration

### Using Different Environment Files

```powershell
# Use custom env file
docker-compose --env-file .env.production up -d
```

### Scaling (Multiple Instances)

```powershell
# Run multiple containers
docker-compose up -d --scale oasis-marine-app=3
```

### Update Without Downtime

```powershell
# Pull latest changes
git pull

# Rebuild and restart with no downtime
docker-compose up -d --build --no-deps oasis-marine-app
```

---

## 🌐 Production Deployment

### Using Docker Compose in Production

```powershell
# Build for production
docker-compose -f docker-compose.yaml build

# Start in production mode
docker-compose up -d

# Enable auto-restart
docker update --restart=always oasis-marine-nextjs
```

### Backup and Restore

```powershell
# Export container
docker export oasis-marine-nextjs > oasis-marine-backup.tar

# Import container
docker import oasis-marine-backup.tar
```

---

## 📱 Access from Mobile/Other Devices

### Get Your Computer's IP

```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*"}
```

### Access from Network

- Replace `localhost` with your IP address
- Example: `http://192.168.1.40:8085`

### Allow Through Firewall

```powershell
New-NetFirewallRule -DisplayName "Oasis Marine Docker" -Direction Inbound -Protocol TCP -LocalPort 8085 -Action Allow -Profile Private
```

---

## 🗑️ Cleanup

### Remove Containers and Images

```powershell
# Stop and remove containers
docker-compose down

# Remove images
docker-compose down --rmi all

# Remove volumes
docker-compose down -v

# Clean everything Docker-related
docker system prune -a --volumes
```

### Reclaim Disk Space

```powershell
# Remove unused data
docker system prune -a

# Remove build cache
docker builder prune -a
```

---

## 🔐 Security Tips

1. **Never commit .env files** with sensitive data
2. **Use secrets management** in production
3. **Regularly update base images**
4. **Scan for vulnerabilities**:
   ```powershell
   docker scan oasis-marine-nextjs
   ```

---

## 📦 What's Configured

### Docker Compose Features:
- ✅ Multi-stage builds for optimization
- ✅ Health checks for monitoring
- ✅ Log rotation (max 10MB, 3 files)
- ✅ Network isolation
- ✅ Auto-restart on failure
- ✅ Resource-efficient Alpine Linux base

### Exposed Ports:
- **8085**: Main application port
- **3000**: Alternative/development port

### Environment Variables:
- Database connection (MongoDB Atlas)
- Cloudinary configuration
- API endpoints
- Production optimizations

---

## ⚡ Performance Tips

1. **Use BuildKit** for faster builds:
   ```powershell
   $env:DOCKER_BUILDKIT=1
   docker-compose build
   ```

2. **Prune regularly** to free space:
   ```powershell
   docker system prune -a
   ```

3. **Monitor resources**:
   ```powershell
   docker stats
   ```

---

## 🆘 Getting Help

### View Container Details
```powershell
docker inspect oasis-marine-nextjs
```

### Access Container Shell
```powershell
docker-compose exec oasis-marine-app sh
```

### Check All Running Containers
```powershell
docker ps -a
```

---

## 🎯 Common Workflows

### Development Workflow
```powershell
# Make code changes
# Rebuild and restart
docker-compose up -d --build
# Check logs
docker-compose logs -f
```

### Deployment Workflow
```powershell
# Pull latest code
git pull
# Build
docker-compose build --no-cache
# Deploy
docker-compose up -d
# Verify
docker-compose ps
```

### Debugging Workflow
```powershell
# Stop services
docker-compose down
# Rebuild
docker-compose build
# Start with logs
docker-compose up
# Fix issues
# Restart in background
docker-compose up -d
```

---

## ✅ Success Indicators

After running `docker-compose up -d`, you should see:

```
✅ Container oasis-marine-nextjs is running
✅ Status: Up (healthy)
✅ Application accessible at http://localhost:8085
✅ Logs show: "✓ Ready in Xs"
```

---

## 📞 Support

If you encounter issues:
1. Check logs: `docker-compose logs -f`
2. Verify container status: `docker-compose ps`
3. Check health: `docker inspect oasis-marine-nextjs --format='{{.State.Health.Status}}'`
4. Review this guide's troubleshooting section

---

**Last Updated**: October 2025
**Docker Compose Version**: 3.8
**Node Version**: 22 Alpine
