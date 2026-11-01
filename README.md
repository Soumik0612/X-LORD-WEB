# X LORD BOT MANAGEMENT

> **Professional 24/7 Bot Hosting & Cloud Container Management Platform**  
> Inspired by high-performance cloud container infrastructure (Pterodactyl Wings LXC & Baileys Multi-Device socket gateways).

---

## 🌟 Overview

**X LORD BOT MANAGEMENT** is a full-featured bot hosting and orchestration platform built for high-uptime WhatsApp Multi-Device (Baileys), Telegram, and Discord bots. It combines an intuitive dark dashboard, a template marketplace, real-time terminal console streaming, crash diagnostics, an automated wallet and deposit system, and multi-role administrative controls.

---

## 🚀 Key Features

### 1. Dashboard (Screenshot 1 Match)
- **Time-Aware Personalized Greeting**: Contextual morning/afternoon/evening greeting with active username and session status.
- **Dynamic 4-Metric Statistics**:
  - **Total Bots**: All provisioned containers.
  - **Dynos Up**: High-speed active 24/7 containers with 99.9% uptime.
  - **Offline Bots**: Halted instances with zero CPU footprint.
  - **Errors & Crashes**: Real-time watchdog detection with shortcut to Crash Doctor.
- **XL Coin Balance Card**: Live coin counter, daily burn rate estimation (~0.16 coins/day per active bot), and quick top-up shortcut.
- **Your Bots Listing**: Live status pills, live CPU/RAM meters, quick Start/Stop/Restart, and console manage buttons.
- **High-Fidelity Empty States**: Guided prompt to browse templates and deploy first container.

### 2. My Bots (Screenshot 2 Match)
- **Real-Time Container Lifecycle**:
  - **Start**: Launches Node.js daemon and binds port.
  - **Stop**: Graceful `SIGTERM` process halt with cgroup cleanup.
  - **Restart**: Graceful reboot with animated status indicator.
  - **Delete**: Permanent container teardown and port release.
- **Live Metric Monitoring**: Live simulated CPU (%) and RAM (MB/512MB) gauges.
- **Interactive Bot Manage Console**:
  - **Live Terminal / Logs**: Streaming interactive console with color codes, autoscroll toggle, clear button, and executable shell commands (`status`, `git pull`, `ping`, `help`).
  - **Environment Variables**: Key-value manager (`SESSION_ID`, `PREFIX`, `OWNER_NUMBER`, `AUTO_READ`, `ALWAYS_ONLINE`) with hot-reload dispatch.
  - **WhatsApp Multi-Device Pairing**: Generate 8-digit WhatsApp pairing code or scan QR code.
  - **Dyno Resources**: Hardware allocation overview and crash recovery routines.

### 3. Bot Templates Marketplace (Screenshot 3 Match)
- **10+ Pre-Configured Verified Templates**:
  - **ARCEUS XD**: Baileys multi-device engine, anti-delete message recovery, auto-status view.
  - **CYPHORX**: Advanced dual WhatsApp and Telegram multi-device bot with Gemini AI commands.
  - **WOLFBOT**: Extreme moderation, anti-link, anti-spam, and group verification captcha.
  - **KETH-MD**: Lightweight media downloader (TikTok, YouTube, IG) and sticker maker.
  - **LIGHT MD**: Low-RAM consumption WhatsApp MD for maximum uptime on low resources.
  - **T3RI**: Telegram community bot with group poll automation and leveling.
  - **FOXY**: Music streaming, YouTube/Spotify audio manipulator.
  - **GAAJU-MD ULTRA**: Multi-group broadcast scheduler.
  - **FRIENDLY-MD**: Beginner-friendly sticker & auto-reaction bot.
  - **ULTRAX**: Discord guild powerhouse with slash commands and ticket systems.
- **Per-Template Actions**:
  - **Deploy**: 1-click launch wizard with custom name, plan selection, and env configuration.
  - **GitHub**: Link to official source repository.
  - **Pair**: Interactive 8-digit Baileys WhatsApp pairing code generation modal.

### 4. Wallet & Payments (Screenshot 4 Match)
- **Financial Metric Cards**: Available Balance, Total Deposited, Total Spent, and Total Transactions.
- **Real Payment Channels Supported**:
  - **Visa & Mastercard Credit Cards**: Instant clearance with 256-bit SSL form validation.
  - **Paystack**: African local and international currency checkout.
  - **Binance Pay**: Direct cryptocurrency transfer with Merchant ID and order tracking.
  - **USDT (TRC-20 & BEP-20)**: Real deposit address with copy button, QR code, and TXID hash submission.
- **Transparent Transaction Ledger**: Complete history with status tracking (`Successful`, `Pending`, `Failed`), search, and type filters.

### 5. Multi-Role RBAC & Admin Portal
- **Super Admin (`admin@xlord.host`)**:
  - Manage all users: credit/deduct coins, block/unblock, delete accounts.
  - System-wide bot control: force restart, stop, or terminate any user's container.
  - Deposit clearance: approve or reject pending USDT crypto deposits with 1 click.
  - Template catalog: publish new templates, edit prices, delete outdated versions.
  - Broadcast notifications: push immediate announcements to all active users.
- **Sub Admin (`moderator@xlord.host`)**:
  - Manage assigned user accounts and monitor dyno container statuses.
- **Normal User (`soumyadey983@gmail.com`)**:
  - Deploy and manage personal bots, top-up balance, and view personal transactions.
- **One-Click Persona Switcher**: Seamlessly switch between Super Admin, Sub Admin, and Regular User in the navigation profile menu to test full permission boundaries.

### 6. Bot Doctor & Recovery Engine ("Recover")
- **One-Click Automated Fixes**:
  - Patch WhatsApp 401 Disconnected socket loops.
  - Purge corrupted Bad MAC / Creds.json lock files.
  - Container cgroup memory purge and cold reboot.
  - Fix npm package dependency tree conflicts.

### 7. Refer & Earn ("Refer")
- **10% Lifetime Affiliate Program**:
  - Personalized copyable referral links (`https://xlord.host/register?ref=XL-...`).
  - Friends receive +25 free starter coins upon registration.
  - Affiliate ledger tracking total invited, active dynos, and lifetime earnings.

---

## 🛠️ Tech Stack

- **Framework**: React 19 SPA + Vite
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss";` + `@custom-variant dark`)
- **Icons**: Lucide Icons (`lucide-react`)
- **Typography**: Plus Jakarta Sans (UI) & JetBrains Mono (Tabular Data & Terminal)
- **Architecture**: Domain-native dark aesthetic (`#080A10` bg, `#10131B` cards, `#3989E8` electric blue accent)

---

## 💻 Development & Build

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Lint / TypeScript verification
npm run lint

# Production build
npm run build
```

---

## 🔒 Security & Environment Variables

- Process secrets and bot tokens (`SESSION_ID`, `TELEGRAM_BOT_TOKEN`, `DISCORD_BOT_TOKEN`) are isolated per container cgroup.
- USDT cryptocurrency deposits undergo manual or cryptographic hash verification to eliminate simulation fraud.

---

## 📄 License & Attribution

Copyright © 2026 **X LORD BOT MANAGEMENT**. All Rights Reserved.
