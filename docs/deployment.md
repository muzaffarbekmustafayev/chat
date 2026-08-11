# 🚀 Deployment — Production ga Chiqarish

> **Stack:** PM2 · Nginx · Docker · GitHub Actions CI/CD

---

## 🏗️ Production Arxitekturasi

```
Internet
    │
    ▼
┌──────────────────────────┐
│   Nginx (Reverse Proxy)   │  Port 80/443
│   + SSL (Let's Encrypt)   │
└────────────┬─────────────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
┌────────┐      ┌──────────┐
│React   │      │Node.js   │
│(Static)│      │(PM2)     │  Port 5000
└────────┘      └────┬─────┘
                     │
                     ▼
               ┌──────────┐
               │ MongoDB  │  Port 27017
               └──────────┘
```

---

## 📦 1 — Frontend Build

```bash
cd frontend

# Production build
npm run build

# dist/ papkasi yaratiladi
# dist/
# ├── index.html
# ├── assets/
# │   ├── index-[hash].js
# │   └── index-[hash].css
```

---

## ⚙️ 2 — Backend Production Sozlamasi

### `.env.production`
```env
NODE_ENV=production
PORT=5000

# MongoDB Atlas
MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/telegram_clone

# JWT (kamida 64 belgili, tasodifiy kalit)
JWT_ACCESS_SECRET=your_super_long_random_secret_key_minimum_64_chars_here
JWT_REFRESH_SECRET=another_super_long_random_secret_key_minimum_64_chars

JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d

# CORS — faqat ruxsat etilgan domain
CLIENT_URL=https://yourdomain.com

AUTO_MIGRATE=false
MAX_FILE_SIZE=52428800
UPLOAD_DIR=/var/www/uploads/
```

---

## 🔧 3 — PM2 bilan ishga tushirish

```bash
# PM2 o'rnatish
npm install -g pm2

# Ekosistema fayli yaratish
```

**File:** `backend/ecosystem.config.js`
```javascript
module.exports = {
  apps: [
    {
      name:         "telegram-clone-api",
      script:       "src/server.js",
      instances:    "max",          // CPU core soni
      exec_mode:    "cluster",      // Klaster rejim
      watch:        false,
      env_production: {
        NODE_ENV: "production",
        PORT:     5000,
      },
      // Log fayllar
      out_file:  "/var/log/pm2/api-out.log",
      error_file:"/var/log/pm2/api-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      // Avtomatik restart
      max_memory_restart: "512M",
      restart_delay:      3000,
    }
  ]
};
```

```bash
# Ishga tushirish
cd backend
NODE_ENV=production pm2 start ecosystem.config.js --env production

# Status tekshirish
pm2 status
pm2 logs telegram-clone-api

# Restart
pm2 restart telegram-clone-api

# Server reboot da avtomatik start
pm2 startup
pm2 save
```

---

## 🌐 4 — Nginx Sozlamasi

**File:** `/etc/nginx/sites-available/telegram-clone`

```nginx
# HTTP → HTTPS redirect
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL (Let's Encrypt)
    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    gzip_min_length 1024;

    # ============ Frontend (React) ============
    location / {
        root   /var/www/telegram-clone/frontend/dist;
        index  index.html;
        try_files $uri $uri/ /index.html;  # SPA routing

        # Cache static assets
        location ~* \.(js|css|png|jpg|svg|ico|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # ============ Backend API ============
    location /api/ {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;

        # Timeout
        proxy_read_timeout    60s;
        proxy_connect_timeout 60s;
    }

    # ============ Socket.IO ============
    location /socket.io/ {
        proxy_pass         http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade    $http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_set_header   Host       $host;
        proxy_cache_bypass $http_upgrade;
    }

    # ============ Yuklangan fayllar ============
    location /uploads/ {
        alias   /var/www/uploads/;
        expires 30d;
        add_header Cache-Control "public";

        # Faqat rasm/video/hujjat ruxsat
        location ~* \.(php|pl|py|cgi)$ {
            deny all;
        }
    }

    # ============ Xavfsizlik ============
    add_header X-Frame-Options        "SAMEORIGIN";
    add_header X-XSS-Protection       "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy        "strict-origin-when-cross-origin";

    client_max_body_size 55M;  # Fayl yuklash limiti
}
```

```bash
# Nginx yoqish
sudo ln -s /etc/nginx/sites-available/telegram-clone \
           /etc/nginx/sites-enabled/

# Sintaksis tekshirish
sudo nginx -t

# Restart
sudo systemctl restart nginx

# SSL sertifikat (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🐳 5 — Docker bilan Deploy

### `backend/Dockerfile`
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Dependency cache
COPY package*.json ./
RUN npm ci --only=production

# Kod nusxa
COPY src/ ./src/

# Yuklamalar papkasi
RUN mkdir -p /app/uploads

# Non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 5000
CMD ["node", "src/server.js"]
```

### `frontend/Dockerfile`
```dockerfile
# Build bosqich
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production bosqich
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### `docker-compose.prod.yml`
```yaml
version: "3.8"

services:
  mongodb:
    image: mongo:7
    restart: always
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
    networks:
      - internal

  backend:
    build: ./backend
    restart: always
    env_file: ./backend/.env.production
    volumes:
      - uploads:/app/uploads
    depends_on:
      - mongodb
    networks:
      - internal
      - external
    ports:
      - "5000:5000"

  frontend:
    build: ./frontend
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - backend
    networks:
      - external

volumes:
  mongo_data:
  uploads:

networks:
  internal:
  external:
```

```bash
# Production deploy
docker-compose -f docker-compose.prod.yml up -d --build

# Loglar
docker-compose -f docker-compose.prod.yml logs -f backend
```

---

## 🔄 6 — GitHub Actions CI/CD

**File:** `.github/workflows/deploy.yml`
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  # ---- TEST ----
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Node.js o'rnatish
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: backend/package-lock.json

      - name: Backend test
        working-directory: ./backend
        run: |
          npm ci
          npm run test:ci

      - name: Frontend test
        working-directory: ./frontend
        run: |
          npm ci
          npm run test:coverage

  # ---- DEPLOY ----
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Serverga SSH bilan deploy
        uses: appleboy/ssh-action@v1
        with:
          host:     ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key:      ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/telegram-clone

            # Kodni yangilash
            git pull origin main

            # Backend yangilash
            cd backend
            npm ci --only=production
            npm run migrate:up
            pm2 restart telegram-clone-api

            # Frontend build
            cd ../frontend
            npm ci
            npm run build

            echo "✅ Deploy muvaffaqiyatli!"
```

### GitHub Secrets (Settings → Secrets):
| Secret | Qiymat |
|--------|--------|
| `SERVER_HOST` | Server IP yoki domain |
| `SERVER_USER` | SSH foydalanuvchi nomi |
| `SSH_PRIVATE_KEY` | SSH kalit (private) |

---

## 📊 Monitoring

```bash
# PM2 monitoring
pm2 monit

# Real-time loglar
pm2 logs --lines 100

# Nginx loglar
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# MongoDB holat
mongosh --eval "db.adminCommand('serverStatus')"

# Disk va RAM
df -h
free -h
htop
```

---

## ✅ Deploy Checklist

```
□ .env.production to'ldirilgan
□ JWT_SECRET kamida 64 belgi
□ MongoDB Atlas yoki production MongoDB
□ Nginx SSL sertifikat o'rnatilgan
□ Firewall: faqat 80, 443, 22 portlar ochiq
□ PM2 startup va save bajarilgan
□ npm run migrate:up bajarilgan
□ Health check ishlayapti: /api/health
□ Frontend build dist/ papkasida
□ Upload papkasiga write ruxsati bor
□ Backup strategiyasi sozlangan
□ Monitoring yoqilgan (pm2 monit)
```
