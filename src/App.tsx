import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Home as HomeIcon, Coffee, ClipboardList, User, Loader2 } from "lucide-react";
import { LiffProvider, useLiff } from "./hooks/useLiff";

// Pages
import HomePage from "./pages/Home";
import BeansPage from "./pages/Beans/BeansList";
import AddBeanPage from "./pages/Beans/AddBean";
import LogsPage from "./pages/Logs/LogsList";
import AddLogPage from "./pages/Logs/AddLog";
import SettingsPage from "./pages/Settings";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-coffee-background text-coffee-text">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-coffee-secondary/20 p-4">
        <h1 className="text-xl font-bold text-coffee-primary tracking-tight">Coffee Profile</h1>
      </header>

      <main className="flex-1 pb-24 p-4 max-w-md mx-auto w-full">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-coffee-secondary/10 flex justify-around items-center p-2 pb-8 z-20">
        <Link
          to="/"
          className="flex flex-col items-center p-2 text-coffee-secondary hover:text-coffee-primary transition-colors"
        >
          <HomeIcon size={22} />
          <span className="text-[10px] mt-1 font-medium">ホーム</span>
        </Link>
        <Link
          to="/beans"
          className="flex flex-col items-center p-2 text-coffee-secondary hover:text-coffee-primary transition-colors"
        >
          <Coffee size={22} />
          <span className="text-[10px] mt-1 font-medium">豆</span>
        </Link>
        <Link
          to="/logs"
          className="flex flex-col items-center p-2 text-coffee-secondary hover:text-coffee-primary transition-colors"
        >
          <ClipboardList size={22} />
          <span className="text-[10px] mt-1 font-medium">記録</span>
        </Link>
        <Link
          to="/settings"
          className="flex flex-col items-center p-2 text-coffee-secondary hover:text-coffee-primary transition-colors"
        >
          <User size={22} />
          <span className="text-[10px] mt-1 font-medium">設定</span>
        </Link>
      </nav>
    </div>
  );
};

const AppContent = () => {
  const { isLoading, error } = useLiff();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-coffee-background">
        <Loader2 className="animate-spin text-coffee-primary mb-4" size={48} />
        <p className="text-coffee-secondary font-medium animate-pulse">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-coffee-background p-6 text-center">
        <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
          <p className="text-red-500 font-bold mb-2">エラーが発生しました</p>
          <p className="text-coffee-secondary text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/beans" element={<BeansPage />} />
          <Route path="/beans/new" element={<AddBeanPage />} />
          <Route path="/logs" element={<LogsPage />} />
          <Route path="/logs/new" element={<AddLogPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

function App() {
  return (
    <LiffProvider>
      <AppContent />
    </LiffProvider>
  );
}

export default App;
