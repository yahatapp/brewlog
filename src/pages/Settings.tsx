import { User, LogOut, ChevronRight } from "lucide-react";
import { useLiff } from "../hooks/useLiff";
import { Card, CardContent } from "../components/ui/card";

const Settings = () => {
  const { profile, liff } = useLiff();

  const handleLogout = () => {
    if (liff?.isLoggedIn()) {
      liff.logout();
      window.location.reload();
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <h2 className="text-xl font-bold text-coffee-primary">設定</h2>

      <Card>
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-coffee-secondary/20 overflow-hidden border-2 border-white shadow-sm">
            {profile?.pictureUrl ? (
              <img
                src={profile.pictureUrl}
                alt={profile.displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <User size={32} className="text-coffee-secondary" />
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-lg text-coffee-primary">
              {profile?.displayName || "ゲストユーザー"}
            </p>
            <p className="text-xs text-coffee-secondary">LINE連携済み</p>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-2">
        <h3 className="text-xs font-bold text-coffee-secondary uppercase tracking-wider ml-1">
          アプリについて
        </h3>
        <Card>
          <div className="divide-y divide-coffee-secondary/10">
            <button className="w-full p-4 flex items-center justify-between text-sm hover:bg-coffee-secondary/5 transition-colors">
              <span>利用規約</span>
              <ChevronRight size={16} className="text-coffee-secondary/40" />
            </button>
            <button className="w-full p-4 flex items-center justify-between text-sm hover:bg-coffee-secondary/5 transition-colors">
              <span>プライバシーポリシー</span>
              <ChevronRight size={16} className="text-coffee-secondary/40" />
            </button>
            <button
              onClick={handleLogout}
              className="w-full p-4 flex items-center space-x-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              <span>ログアウト</span>
            </button>
          </div>
        </Card>
      </section>

      <div className="text-center">
        <p className="text-[10px] text-coffee-secondary/40">Coffee Profile v0.1.0</p>
      </div>
    </div>
  );
};

export default Settings;
