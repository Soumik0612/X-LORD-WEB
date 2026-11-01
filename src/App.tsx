/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { DashboardView } from './views/DashboardView';
import { MyBotsView } from './views/MyBotsView';
import { TemplatesView } from './views/TemplatesView';
import { WalletView } from './views/WalletView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { RecoverView } from './views/RecoverView';
import { ReferView } from './views/ReferView';
import { DeployModal } from './components/DeployModal';
import { PairCodeModal } from './components/PairCodeModal';
import { BotManageModal } from './components/BotManageModal';
import { AddFundsModal } from './components/AddFundsModal';
import { AuthModal } from './components/AuthModal';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#080A10] text-[#F3F4F6]">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'my-bots' && <MyBotsView />}
        {activeTab === 'templates' && <TemplatesView />}
        {activeTab === 'wallet' && <WalletView />}
        {activeTab === 'recover' && <RecoverView />}
        {activeTab === 'refer' && <ReferView />}
        {activeTab === 'admin' && <AdminDashboardView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Fixed Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Interactive Modals */}
      <DeployModal />
      <PairCodeModal />
      <BotManageModal />
      <AddFundsModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
