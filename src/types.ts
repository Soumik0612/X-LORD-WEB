export type UserRole = 'super_admin' | 'sub_admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  coins: number;
  totalDeposited: number;
  totalSpent: number;
  isBlocked: boolean;
  createdAt: string;
  referralCode: string;
  referredBy?: string;
  assignedUsers?: string[]; // for sub_admin
}

export type BotStatus = 'online' | 'offline' | 'restarting' | 'error';

export interface LogEntry {
  timestamp: string;
  text: string;
  type: 'info' | 'error' | 'warn' | 'success';
}

export interface Bot {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  category: string;
  status: BotStatus;
  cpu: number; // percentage e.g. 14.2
  ramMb: number; // e.g. 182
  ramMaxMb: number; // e.g. 512
  uptimeSeconds: number;
  nodeLocation: string;
  port: number;
  autoRestart: boolean;
  userId: string;
  ownerName: string;
  createdAt: string;
  pairingCode?: string;
  phoneNumber?: string;
  envVars: Record<string, string>;
  logs: LogEntry[];
}

export interface Template {
  id: string;
  name: string;
  category: 'WhatsApp MD' | 'Moderation' | 'Telegram' | 'Discord' | 'Multi-Device' | 'Music & Fun';
  description: string;
  hostingPlan: 'Free Dyno' | 'Pro Dyno (5 Coins/mo)' | 'Turbo Dyno (12 Coins/mo)';
  planPriceCoins: number;
  deploymentCount: number;
  isFeatured: boolean;
  githubUrl: string;
  image: string;
  version: string;
  author: string;
  defaultEnv: Record<string, string>;
}

export type TransactionType = 'deposit' | 'hosting_fee' | 'bot_deploy' | 'referral_bonus' | 'admin_adjustment';
export type PaymentMethod = 'Card Payment' | 'Visa' | 'Mastercard' | 'Paystack' | 'Binance Pay' | 'USDT';
export type TransactionStatus = 'successful' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  type: TransactionType;
  amount: number; // in coins
  amountUsd: number;
  date: string;
  method: PaymentMethod;
  status: TransactionStatus;
  txHash?: string;
  description: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
}

export interface NodeServer {
  id: string;
  name: string;
  region: string;
  country: string;
  flag: string;
  status: 'operational' | 'degraded' | 'maintenance';
  cpuLoad: number;
  memoryUsage: number;
  activeDynos: number;
}

export interface SystemSettings {
  announcement: string;
  showAnnouncement: boolean;
  coinPriceUsd: number; // e.g. $0.10 per coin
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  usdtTrc20Address: string;
  usdtBep20Address: string;
  binancePayId: string;
}
