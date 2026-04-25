# Animal Shelter Manager

Based on the open-source [Animal Shelter Manager](https://sheltermanager.com/site/en_home.html) project — this is a simplified, single-shelter reimplementation focused on core functionality.

**Important:** This app uses SQLite for data storage. SQLite works well for single-server deployments but is not suitable for multi-server or high-concurrency production environments. For production use with multiple users, consider migrating to PostgreSQL.

## What this includes (vs. the original)

**Included:**
- Animal CRUD (list, detail, add, edit)
- Medical records tracking
- Financial entries (donations, adoptions, expenses)
- Reports overview
- Dashboard with stats, overview chart, and recent activity flow
- Activity logging for shelter events
- Responsive UI with light/dark mode

**Not included (present in the original):**
- Multi-shelter management
- Online adoption portal and public animal listings
- Digital adoption application forms
- Staff scheduling and volunteer management
- Regulatory compliance and complaints handling
- Fundraising pages and campaign management
- License and permit tracking
- Multi-user authentication and role-based access
- Document uploads and attachments
- Email notifications and reminders
- SMS messaging
- Payment processing integration
- Advanced reporting and data exports

The original is a full SaaS platform designed for shelters with multiple staff members and public-facing portals. This project is a lightweight internal tool for a single shelter team.

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, React Router, TanStack Query, shadcn/ui (Radix UI), Tailwind CSS, Recharts
- **Backend**: Python stdlib (no framework), SQLite
- **Testing**: Vitest + Playwright

## Run locally

Both servers must run simultaneously:

```bash
npm run backend  # Python API server on http://127.0.0.1:8000
npm run dev      # Vite dev server on http://localhost:8080
```

Vite proxies `/api/*` → `http://127.0.0.1:8000`.

## Commands

```bash
npm run dev        # Start frontend (port 8080)
npm run backend    # Start Python API server (port 8000)
npm run build      # Production build
npm run lint       # ESLint
npm test           # Vitest tests
npm run test:watch # Watch mode
```

## Architecture

- **Backend**: `src/backend/server.py` — ThreadingHTTPServer with RESTful endpoints, auto-creates `data/shelter.db` with seed data on first run
- **Frontend API**: `src/lib/api.ts` — typed fetch wrapper; `src/hooks/use-shelter-api.ts` — TanStack Query hooks
- **Pages**: Dashboard, Animals (list/detail/add/edit), Medical, Financial, Reports, Settings

## Routes

```
/                   → Dashboard
/animals            → Animal list
/animals/add        → Add animal
/animals/:id        → Animal detail
/animals/:id/edit   → Edit animal
/medical            → Medical records
/financial          → Financial data
/reports            → Reports
/settings           → Settings
```

## Deployment

### Linux / Unix (Ubuntu, Debian, etc.)

1. **Install dependencies**
   ```bash
   sudo apt update && sudo apt install -y python3 python3-venv nodejs npm git
   ```

2. **Clone and build**
   ```bash
   git clone <repository-url>
   cd shelter-app
   npm install
   npm run build
   ```

3. **Run backend** (production)
   ```bash
   npm run backend
   ```
   Runs on `http://127.0.0.1:8000`. Use a process manager like `systemd` or `supervisor` to keep it running.

4. **Serve frontend** — point a web server (nginx, Caddy) to `dist/` for static files and proxy `/api` to `http://127.0.0.1:8000`

5. **Reverse proxy example (nginx)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           root /path/to/shelter-app/dist;
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
       }
   }
   ```
   For HTTPS, add `listen 443 ssl` with your cert paths.

6. **systemd service**
   ```ini
   [Unit]
   Description=Animal Shelter Backend
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/path/to/shelter-app
   ExecStart=/usr/bin/python3 /path/to/shelter-app/src/backend/server.py
   Restart=on-failure

   [Install]
   WantedBy=multi-user.target
   ```
   Save to `/etc/systemd/system/shelter-backend.service`, then:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable shelter-backend
   sudo systemctl start shelter-backend
   ```

---

### macOS

1. **Install dependencies** — Python3 and Node.js usually pre-installed:
   ```bash
   python3 --version
   node --version
   npm --version
   ```
   If missing, install via [Homebrew](https://brew.sh):
   ```bash
   brew install python node
   ```

2. **Clone and build**
   ```bash
   git clone <repository-url>
   cd shelter-app
   npm install
   npm run build
   ```

3. **Run backend**
   ```bash
   npm run backend
   ```
   Runs on `http://127.0.0.1:8000`. For auto-restart on login, use `launchd` or `pm2`.

4. **Serve frontend** — `dist/` contains static build output. Serve with any web server or run `npm run dev` for local testing.

---

### Windows

1. **Install dependencies**
   - Python 3.x — [python.org/downloads](https://www.python.org/downloads/)
   - Node.js — [nodejs.org](https://nodejs.org/)
   - Git — [git-scm.com/download/win](https://git-scm.com/download/win)

2. **Clone and build**
   ```powershell
   git clone <repository-url>
   cd shelter-app
   npm install
   npm run build
   ```

3. **Run backend**
   ```powershell
   npm run backend
   ```
   Runs on `http://127.0.0.1:8000`. For production, use Task Scheduler or NSSM to run as a Windows Service.

4. **Serve frontend** — `dist/` is static output. Configure IIS or nginx to serve files and proxy `/api` to `http://127.0.0.1:8000`.

---

### AWS EC2 (Ubuntu)

1. **Launch an EC2 instance** (Ubuntu 22.04 LTS recommended)

2. **SSH in, install dependencies**
   ```bash
   sudo apt update && sudo apt install -y python3 python3-venv nodejs npm git nginx certbot
   ```

3. **Clone and build** (same as Linux steps above)

4. **Configure nginx** (same as Linux config above), then:
   ```bash
   sudo systemctl enable nginx
   sudo systemctl start nginx
   ```

5. **Set up HTTPS with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

6. **Run backend** via systemd service (same as Linux systemd section above)

7. **Open firewall** — allow ports 80 and 443 in EC2 security group

8. **Database backup** — SQLite at `data/shelter.db`. Set up a cron job:
   ```bash
   crontab -e
   # Add: 0 2 * * * cp /path/to/shelter-app/data/shelter.db /path/to/backups/shelter-$(date +\%Y\%m\%d).db
   ```
