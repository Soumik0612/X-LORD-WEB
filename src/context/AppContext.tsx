import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Bot,
  Template,
  Transaction,
  SystemNotification,
  NodeServer,
  SystemSettings,
  PaymentMethod,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_TEMPLATES,
  INITIAL_BOTS,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_NODES,
  INITIAL_SETTINGS,
} from '../data/initialData';

export type AppTab = 'dashboard' | 'my-bots' | 'templates' | 'wallet' | 'recover' | 'refer' | 'admin' | 'settings';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  bots: Bot[];
  userBots: Bot[];
  templates: Template[];
  transactions: Transaction[];
  userTransactions: Transaction[];
  notifications: SystemNotification[];
  nodes: NodeServer[];
  settings: SystemSettings;
  activeTab: AppTab;
  theme: 'dark' | 'light';
  isAuthModalOpen: boolean;
  selectedBotForManage: Bot | null;
  selectedTemplateForDeploy: Template | null;
  isPairCodeModalOpen: boolean;
  activePairTemplate: Template | null;
  isAddFundsModalOpen: boolean;
  unreadNotifCount: number;

  // Navigation & UI controls
  setActiveTab: (tab: AppTab) => void;
  toggleTheme: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openBotManageModal: (bot: Bot | null) => void;
  openDeployModal: (template: Template | null) => void;
  openPairCodeModal: (template: Template | null) => void;
  openAddFundsModal: (open: boolean) => void;

  // Auth & Roles
  switchUser: (userId: string) => void;
  login: (email: string) => boolean;
  register: (name: string, email: string, referralCode?: string) => boolean;
  logout: () => void;

  // Bot Lifecycle & Hosting
  deployBot: (name: string, templateId: string, customEnv: Record<string, string>) => { success: boolean; message: string };
  startBot: (botId: string) => void;
  stopBot: (botId: string) => void;
  restartBot: (botId: string) => void;
  deleteBot: (botId: string) => void;
  updateBotEnv: (botId: string, newEnv: Record<string, string>) => void;
  requestBotPairingCode: (botId: string, phoneNumber: string) => string;
  addBotConsoleCommand: (botId: string, cmd: string) => void;

  // Wallet & Payments
  addDeposit: (amountCoins: number, method: PaymentMethod, txHash?: string) => void;
  approveTransaction: (txId: string) => void;
  rejectTransaction: (txId: string) => void;

  // Admin Controls
  addCoinsToUser: (userId: string, amount: number) => void;
  toggleUserBlock: (userId: string) => void;
  deleteUser: (userId: string) => void;
  createTemplate: (template: Omit<Template, 'id'>) => void;
  deleteTemplate: (templateId: string) => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  broadcastNotification: (title: string, message: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Doctor & Recover
  runBotDoctor: (botId: string, actionType: 'clear_session' | 'restart_clean' | 'auto_fix_deps' | 'patch_baileys') => string;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('xlord_theme') as 'dark' | 'light') || 'dark';
  });

  // Load from localStorage or defaults
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('xlord_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('xlord_current_user_id') || 'usr_normal1';
  });

  const [bots, setBots] = useState<Bot[]>(() => {
    const saved = localStorage.getItem('xlord_bots');
    return saved ? JSON.parse(saved) : INITIAL_BOTS;
  });

  const [templates, setTemplates] = useState<Template[]>(() => {
    const saved = localStorage.getItem('xlord_templates');
    return saved ? JSON.parse(saved) : INITIAL_TEMPLATES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('xlord_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('xlord_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [nodes] = useState<NodeServer[]>(INITIAL_NODES);

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('xlord_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedBotForManage, setSelectedBotForManage] = useState<Bot | null>(null);
  const [selectedTemplateForDeploy, setSelectedTemplateForDeploy] = useState<Template | null>(null);
  const [isPairCodeModalOpen, setIsPairCodeModalOpen] = useState(false);
  const [activePairTemplate, setActivePairTemplate] = useState<Template | null>(null);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('xlord_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('xlord_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('xlord_current_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('xlord_bots', JSON.stringify(bots));
  }, [bots]);

  useEffect(() => {
    localStorage.setItem('xlord_templates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('xlord_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('xlord_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('xlord_settings', JSON.stringify(settings));
  }, [settings]);

  // Keep selected bot updated if bots list changes
  useEffect(() => {
    if (selectedBotForManage) {
      const refreshed = bots.find(b => b.id === selectedBotForManage.id);
      if (refreshed) {
        setSelectedBotForManage(refreshed);
      }
    }
  }, [bots]);

  // Live simulation of metrics and uptime every 4 seconds for online bots
  useEffect(() => {
    const interval = setInterval(() => {
      setBots(prevBots =>
        prevBots.map(bot => {
          if (bot.status !== 'online') return bot;
          // slight fluctuation in cpu and ram
          const cpuDelta = (Math.random() - 0.5) * 4;
          const newCpu = Math.max(3.2, Math.min(88, Number((bot.cpu + cpuDelta).toFixed(1))));
          const ramDelta = Math.floor((Math.random() - 0.5) * 8);
          const newRam = Math.max(80, Math.min(bot.ramMaxMb - 20, bot.ramMb + ramDelta));
          return {
            ...bot,
            cpu: newCpu,
            ramMb: newRam,
            uptimeSeconds: bot.uptimeSeconds + 4,
          };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentUser = users.find(u => u.id === currentUserId) || null;

  // Filter bots for current user if regular user, or all if super admin, or assigned if sub admin
  const userBots = bots.filter(b => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    if (currentUser.role === 'sub_admin') {
      return b.userId === currentUser.id || (currentUser.assignedUsers?.includes(b.userId) ?? false);
    }
    return b.userId === currentUser.id;
  });

  const userTransactions = transactions.filter(t => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    return t.userId === currentUser.id;
  });

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUserId(userId);
    }
  };

  const login = (email: string): boolean => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      if (found.isBlocked) return false;
      setCurrentUserId(found.id);
      setIsAuthModalOpen(false);
      return true;
    }
    // Create new quick session if doesn't exist
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: 'user',
      coins: 50,
      totalDeposited: 0,
      totalSpent: 0,
      isBlocked: false,
      createdAt: new Date().toISOString().split('T')[0],
      referralCode: `XL-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    };
    setUsers(prev => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    setIsAuthModalOpen(false);
    return true;
  };

  const register = (name: string, email: string, referralCode?: string): boolean => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return false;

    let bonusCoins = 50; // Starter gift
    if (referralCode) {
      bonusCoins += 25; // Bonus with referral
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: 'user',
      coins: bonusCoins,
      totalDeposited: 0,
      totalSpent: 0,
      isBlocked: false,
      createdAt: new Date().toISOString().split('T')[0],
      referralCode: `XL-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      referredBy: referralCode,
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    // Switch to first available user or create clean user
    setCurrentUserId('usr_normal1');
  };

  const deployBot = (name: string, templateId: string, customEnv: Record<string, string>): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'Please log in first' };
    const template = templates.find(t => t.id === templateId);
    if (!template) return { success: false, message: 'Template not found' };

    const planCost = template.planPriceCoins;
    if (currentUser.coins < planCost) {
      return {
        success: false,
        message: `Insufficient coin balance! You need ${planCost} XL Coins, but only have ${currentUser.coins} coins. Please top up your wallet.`,
      };
    }

    // Deduct coins if cost > 0
    if (planCost > 0) {
      setUsers(prev =>
        prev.map(u =>
          u.id === currentUser.id
            ? { ...u, coins: u.coins - planCost, totalSpent: u.totalSpent + planCost }
            : u
        )
      );

      // Record transaction
      const newTx: Transaction = {
        id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: currentUser.name,
        type: 'bot_deploy',
        amount: -planCost,
        amountUsd: Number((planCost * settings.coinPriceUsd).toFixed(2)),
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        method: 'Card Payment',
        status: 'successful',
        description: `Deployment fee for ${name} (${template.name})`,
      };
      setTransactions(prev => [newTx, ...prev]);
    }

    // Increment template deploy count
    setTemplates(prev =>
      prev.map(t => (t.id === templateId ? { ...t, deploymentCount: t.deploymentCount + 1 } : t))
    );

    // Create new Bot instance
    const newBotId = `XL-BOT-${Math.floor(10000 + Math.random() * 90000)}`;
    const port = 3000 + Math.floor(Math.random() * 4000);
    const timeStr = new Date().toLocaleTimeString();

    const newBot: Bot = {
      id: newBotId,
      name,
      templateId,
      templateName: `${template.name} ${template.version}`,
      category: template.category,
      status: 'online',
      cpu: Number((12 + Math.random() * 15).toFixed(1)),
      ramMb: 140 + Math.floor(Math.random() * 60),
      ramMaxMb: 512,
      uptimeSeconds: 1,
      nodeLocation: 'Node-01 Frankfurt (DE)',
      port,
      autoRestart: true,
      userId: currentUser.id,
      ownerName: currentUser.name,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      pairingCode: `XL${Math.floor(10 + Math.random() * 89)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      phoneNumber: customEnv.OWNER_NUMBER || '+91 90000 00000',
      envVars: {
        ...template.defaultEnv,
        ...customEnv,
        PORT: `${port}`,
      },
      logs: [
        { timestamp: timeStr, text: `[PROVISION] Allocated cgroup LXC container on Node-01 (${newBotId})`, type: 'info' },
        { timestamp: timeStr, text: `[REPO] Cloning template repository: ${template.githubUrl}...`, type: 'info' },
        { timestamp: timeStr, text: '[BUILD] Container dependencies resolved and cached.', type: 'info' },
        { timestamp: timeStr, text: '[ENV] Applied environment configuration variables.', type: 'info' },
        { timestamp: timeStr, text: `[START] Bot ${name} started successfully on port ${port}. Status: 200 OK.`, type: 'success' },
      ],
    };

    setBots(prev => [newBot, ...prev]);
    setSelectedTemplateForDeploy(null);

    // Add notification
    const newNotif: SystemNotification = {
      id: `notif_${Date.now()}`,
      title: 'Bot Deployed Successfully',
      message: `Your bot "${name}" was created and started on Node-01 Frankfurt.`,
      date: 'Just now',
      read: false,
      type: 'success',
    };
    setNotifications(prev => [newNotif, ...prev]);

    return { success: true, message: `Bot "${name}" successfully deployed and running!` };
  };

  const startBot = (botId: string) => {
    const timeStr = new Date().toLocaleTimeString();
    setBots(prev =>
      prev.map(b => {
        if (b.id !== botId) return b;
        return {
          ...b,
          status: 'online',
          cpu: Number((10 + Math.random() * 12).toFixed(1)),
          ramMb: 130 + Math.floor(Math.random() * 50),
          logs: [
            ...b.logs,
            { timestamp: timeStr, text: `[COMMAND] Received Start command from user. Spawning node daemon...`, type: 'info' },
            { timestamp: timeStr, text: `[RUNTIME] Dyno listening on port ${b.port}. WebSocket connected.`, type: 'success' },
          ],
        };
      })
    );
  };

  const stopBot = (botId: string) => {
    const timeStr = new Date().toLocaleTimeString();
    setBots(prev =>
      prev.map(b => {
        if (b.id !== botId) return b;
        return {
          ...b,
          status: 'offline',
          cpu: 0,
          ramMb: 0,
          logs: [
            ...b.logs,
            { timestamp: timeStr, text: `[COMMAND] Received Stop command. Sending SIGTERM to process tree...`, type: 'warn' },
            { timestamp: timeStr, text: `[CONTAINER] Dyno container halted. Resources released.`, type: 'info' },
          ],
        };
      })
    );
  };

  const restartBot = (botId: string) => {
    const timeStr = new Date().toLocaleTimeString();
    setBots(prev =>
      prev.map(b => {
        if (b.id !== botId) return b;
        return {
          ...b,
          status: 'restarting',
          logs: [
            ...b.logs,
            { timestamp: timeStr, text: `[RESTART] Triggering graceful restart cycle...`, type: 'warn' },
          ],
        };
      })
    );

    // After 1.5 seconds, set back to online
    setTimeout(() => {
      const finishTimeStr = new Date().toLocaleTimeString();
      setBots(prev =>
        prev.map(b => {
          if (b.id !== botId) return b;
          return {
            ...b,
            status: 'online',
            cpu: Number((14 + Math.random() * 10).toFixed(1)),
            ramMb: 145 + Math.floor(Math.random() * 40),
            uptimeSeconds: 0,
            logs: [
              ...b.logs,
              { timestamp: finishTimeStr, text: `[RESTART] Dyno container booted. Services re-initialized!`, type: 'success' },
            ],
          };
        })
      );
    }, 1500);
  };

  const deleteBot = (botId: string) => {
    setBots(prev => prev.filter(b => b.id !== botId));
    if (selectedBotForManage?.id === botId) {
      setSelectedBotForManage(null);
    }
  };

  const updateBotEnv = (botId: string, newEnv: Record<string, string>) => {
    const timeStr = new Date().toLocaleTimeString();
    setBots(prev =>
      prev.map(b => {
        if (b.id !== botId) return b;
        return {
          ...b,
          envVars: newEnv,
          logs: [
            ...b.logs,
            { timestamp: timeStr, text: `[CONFIG] Updated environment variables. Hot-reload dispatched.`, type: 'info' },
          ],
        };
      })
    );
  };

  const requestBotPairingCode = (botId: string, phoneNumber: string): string => {
    const prefix = ['XL', 'WA', 'MD', 'BT'][Math.floor(Math.random() * 4)];
    const code = `${prefix}${Math.floor(10 + Math.random() * 89)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const timeStr = new Date().toLocaleTimeString();

    setBots(prev =>
      prev.map(b => {
        if (b.id !== botId) return b;
        return {
          ...b,
          pairingCode: code,
          phoneNumber,
          logs: [
            ...b.logs,
            { timestamp: timeStr, text: `[BAILEYS] Generated 8-digit WhatsApp Pairing Code: ${code} for ${phoneNumber}`, type: 'success' },
          ],
        };
      })
    );

    return code;
  };

  const addBotConsoleCommand = (botId: string, cmd: string) => {
    const timeStr = new Date().toLocaleTimeString();
    let responseText = `Executed: "${cmd}". Exit code 0.`;
    let responseType: 'info' | 'success' | 'warn' | 'error' = 'info';

    const normalized = cmd.trim().toLowerCase();
    if (normalized === 'help') {
      responseText = `Available Commands: npm start | npm stop | git pull | status | env | clear | cat package.json | ping`;
    } else if (normalized.startsWith('git pull')) {
      responseText = `remote: Enumerating objects: 4, done.\nremote: Total 4 (delta 2), reused 4\nUpdating branch 'main'... Fast-forward. 1 file changed.`;
      responseType = 'success';
    } else if (normalized === 'ping') {
      responseText = `PONG! Host latency to WhatsApp gateway: 18.4ms. Node: Frankfurt-01`;
      responseType = 'success';
    } else if (normalized === 'status') {
      responseText = `Process: Node.js v22.14.0 | Cgroup: Isolated | Ports: Open | Heap: OK`;
      responseType = 'info';
    }

    setBots(prev =>
      prev.map(b => {
        if (b.id !== botId) return b;
        return {
          ...b,
          logs: [
            ...b.logs,
            { timestamp: timeStr, text: `$ ${cmd}`, type: 'info' },
            { timestamp: timeStr, text: responseText, type: responseType },
          ],
        };
      })
    );
  };

  const addDeposit = (amountCoins: number, method: PaymentMethod, txHash?: string) => {
    if (!currentUser) return;
    const isCrypto = method === 'USDT';
    const initialStatus = isCrypto ? 'pending' : 'successful';
    const amountUsd = Number((amountCoins * settings.coinPriceUsd).toFixed(2));

    const newTx: Transaction = {
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.name,
      type: 'deposit',
      amount: amountCoins,
      amountUsd,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      method,
      status: initialStatus,
      txHash: txHash || (isCrypto ? undefined : `card_${Date.now()}`),
      description: `Wallet top-up (${amountCoins} XL Coins via ${method})`,
    };

    setTransactions(prev => [newTx, ...prev]);

    if (!isCrypto) {
      // Credit immediately
      setUsers(prev =>
        prev.map(u =>
          u.id === currentUser.id
            ? {
                ...u,
                coins: u.coins + amountCoins,
                totalDeposited: u.totalDeposited + amountUsd,
              }
            : u
        )
      );

      // Notification
      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          title: 'Deposit Successful',
          message: `Credited ${amountCoins} XL Coins ($${amountUsd}) via ${method}.`,
          date: 'Just now',
          read: false,
          type: 'success',
        },
        ...prev,
      ]);
    } else {
      // Crypto notification awaiting approval
      setNotifications(prev => [
        {
          id: `notif_${Date.now()}`,
          title: 'Deposit Submitted (Pending Review)',
          message: `Your deposit of ${amountCoins} Coins via USDT is pending blockchain confirmation.`,
          date: 'Just now',
          read: false,
          type: 'info',
        },
        ...prev,
      ]);
    }

    setIsAddFundsModalOpen(false);
  };

  const approveTransaction = (txId: string) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx || tx.status !== 'pending') return;

    setTransactions(prev =>
      prev.map(t => (t.id === txId ? { ...t, status: 'successful' } : t))
    );

    // Credit coins to user
    setUsers(prev =>
      prev.map(u =>
        u.id === tx.userId
          ? {
              ...u,
              coins: u.coins + tx.amount,
              totalDeposited: u.totalDeposited + tx.amountUsd,
            }
          : u
      )
    );
  };

  const rejectTransaction = (txId: string) => {
    setTransactions(prev =>
      prev.map(t => (t.id === txId ? { ...t, status: 'failed' } : t))
    );
  };

  const addCoinsToUser = (userId: string, amount: number) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id !== userId) return u;
        const newTotal = Math.max(0, u.coins + amount);
        return { ...u, coins: newTotal };
      })
    );

    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      const newTx: Transaction = {
        id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
        userId,
        userEmail: targetUser.email,
        userName: targetUser.name,
        type: 'admin_adjustment',
        amount,
        amountUsd: Number((amount * settings.coinPriceUsd).toFixed(2)),
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        method: 'Card Payment',
        status: 'successful',
        description: `Admin balance adjustment (${amount > 0 ? '+' : ''}${amount} XL Coins)`,
      };
      setTransactions(prev => [newTx, ...prev]);
    }
  };

  const toggleUserBlock = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u))
    );
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setBots(prev => prev.filter(b => b.userId !== userId));
  };

  const createTemplate = (templateData: Omit<Template, 'id'>) => {
    const newTmpl: Template = {
      ...templateData,
      id: `tmpl_${Date.now()}`,
    };
    setTemplates(prev => [newTmpl, ...prev]);
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const broadcastNotification = (title: string, message: string) => {
    const newNotif: SystemNotification = {
      id: `notif_${Date.now()}`,
      title,
      message,
      date: 'Just now',
      read: false,
      type: 'info',
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const runBotDoctor = (botId: string, actionType: 'clear_session' | 'restart_clean' | 'auto_fix_deps' | 'patch_baileys'): string => {
    const timeStr = new Date().toLocaleTimeString();
    let msg = '';
    if (actionType === 'clear_session') {
      msg = 'Cleared Baileys auth session cache files. Ready for fresh pairing code.';
    } else if (actionType === 'restart_clean') {
      msg = 'Performed container cgroup memory purge and clean cold reboot.';
    } else if (actionType === 'auto_fix_deps') {
      msg = 'Ran `npm audit fix --force` and patched node_modules dependencies.';
    } else {
      msg = 'Applied Baileys WhatsApp 401 Disconnect anti-ban auto-reconnect patch.';
    }

    setBots(prev =>
      prev.map(b => {
        if (b.id !== botId) return b;
        return {
          ...b,
          status: 'online',
          logs: [
            ...b.logs,
            { timestamp: timeStr, text: `[CRASH-DOCTOR] Executing: ${actionType}...`, type: 'warn' },
            { timestamp: timeStr, text: `[CRASH-DOCTOR] ${msg}`, type: 'success' },
          ],
        };
      })
    );

    return msg;
  };

  const resetAllData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUserId('usr_normal1');
    setBots(INITIAL_BOTS);
    setTemplates(INITIAL_TEMPLATES);
    setTransactions(INITIAL_TRANSACTIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_SETTINGS);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        bots,
        userBots,
        templates,
        transactions,
        userTransactions,
        notifications,
        nodes,
        settings,
        activeTab,
        theme,
        isAuthModalOpen,
        selectedBotForManage,
        selectedTemplateForDeploy,
        isPairCodeModalOpen,
        activePairTemplate,
        isAddFundsModalOpen,
        unreadNotifCount,

        setActiveTab,
        toggleTheme,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        openBotManageModal: setSelectedBotForManage,
        openDeployModal: setSelectedTemplateForDeploy,
        openPairCodeModal: (template) => {
          setActivePairTemplate(template);
          setIsPairCodeModalOpen(true);
        },
        openAddFundsModal: setIsAddFundsModalOpen,

        switchUser,
        login,
        register,
        logout,

        deployBot,
        startBot,
        stopBot,
        restartBot,
        deleteBot,
        updateBotEnv,
        requestBotPairingCode,
        addBotConsoleCommand,

        addDeposit,
        approveTransaction,
        rejectTransaction,

        addCoinsToUser,
        toggleUserBlock,
        deleteUser,
        createTemplate,
        deleteTemplate,
        updateSettings,
        broadcastNotification,

        markNotificationRead,
        markAllNotificationsRead,

        runBotDoctor,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
