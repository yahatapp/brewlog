import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Coffee, ChevronRight, Loader2 } from "lucide-react";
import { useLiff } from "../../hooks/useLiff";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

interface Bean {
  id: string;
  name: string;
  origin: string | null;
  roastLevel: number | null;
  purchaseDate: string | null;
  createdAt: string;
}

const BeansList = () => {
  const navigate = useNavigate();
  const { api } = useLiff();
  const [beans, setBeans] = useState<Bean[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBeans = async () => {
      if (!api) return;
      try {
        const res = await api.beans.$get();
        if (res.ok) {
          const data = await res.json();
          setBeans(data as Bean[]);
        }
      } catch (err) {
        console.error("Failed to fetch beans", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBeans();
  }, [api]);

  const getRoastLabel = (level: number | null) => {
    if (!level) return null;
    const labels = ["浅煎り", "中浅煎り", "中煎り", "中深煎り", "深煎り"];
    return labels[level - 1] || "不明";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-coffee-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-coffee-primary">コーヒー豆一覧</h2>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full"
          onClick={() => navigate("/beans/new")}
        >
          <Plus size={16} className="mr-1" /> 追加
        </Button>
      </div>

      {beans.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            <Coffee className="mx-auto text-coffee-secondary/30 mb-4" size={48} />
            <p className="text-coffee-secondary text-sm">登録されている豆はありません。</p>
            <p className="text-xs text-coffee-secondary/60 mt-2">
              お気に入りの豆を登録しましょう！
            </p>
            <Button className="mt-6 rounded-xl" onClick={() => navigate("/beans/new")}>
              豆を登録する
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {beans.map((bean) => (
            <Card
              key={bean.id}
              className="hover:border-coffee-primary/30 transition-colors cursor-pointer group"
              onClick={() => navigate(`/logs/new?beanId=${bean.id}`)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-coffee-background p-3 rounded-2xl group-hover:bg-coffee-primary/10 transition-colors">
                    <Coffee size={24} className="text-coffee-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-coffee-text">{bean.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {bean.origin && (
                        <span className="text-[10px] text-coffee-secondary bg-coffee-secondary/10 px-2 py-0.5 rounded-full">
                          {bean.origin}
                        </span>
                      )}
                      {bean.roastLevel && (
                        <span className="text-[10px] text-coffee-secondary bg-coffee-secondary/10 px-2 py-0.5 rounded-full">
                          {getRoastLabel(bean.roastLevel)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-coffee-secondary/40 group-hover:text-coffee-primary transition-colors"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BeansList;
