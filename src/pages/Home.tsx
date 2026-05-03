import { useNavigate } from "react-router-dom";
import { Plus, Coffee, ClipboardList } from "lucide-react";
import { useLiff } from "../hooks/useLiff";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const Home = () => {
  const { profile } = useLiff();
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-coffee-primary mb-1">
          こんにちは、{profile?.displayName || "ゲスト"}さん
        </h2>
        <p className="text-coffee-secondary text-sm">今日はどんなコーヒーを淹れますか？</p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">最近の抽出記録</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-coffee-secondary text-sm text-center py-4">まだ記録がありません。</p>
          <Button className="w-full mt-2 rounded-xl" onClick={() => navigate("/logs/new")}>
            <Plus size={18} className="mr-2" />
            抽出を記録する
          </Button>
        </CardContent>
      </Card>

      <section className="grid grid-cols-2 gap-4">
        <Card
          className="hover:border-coffee-primary/30 transition-colors cursor-pointer"
          onClick={() => navigate("/beans")}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
            <Coffee size={24} className="text-coffee-secondary" />
            <span className="text-sm font-semibold">豆を管理</span>
          </CardContent>
        </Card>
        <Card
          className="hover:border-coffee-primary/30 transition-colors cursor-pointer"
          onClick={() => navigate("/logs")}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
            <ClipboardList size={24} className="text-coffee-secondary" />
            <span className="text-sm font-semibold">履歴を見る</span>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Home;
