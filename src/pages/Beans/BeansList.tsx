import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Coffee, ChevronRight, Loader2, Pencil } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { OriginFlag } from "../../components/ui/OriginFlag";
import { getCountryCode } from "@/utils/flag";
import { CoffeeBeansIcon } from "../../components/ui/CoffeeBeansIcon";
import { RoastLevelIndicator } from "../../components/ui/RoastLevelIndicator";

interface Bean {
  id: string;
  name: string;
  origin: string | null;
  purchaseStore: string | null;
  roastLevel: number | null;
  purchaseDate: string | null;
  isArchived: boolean;
  createdAt: string;
  processMethod?: string | null;
}

const BeansList = () => {
  const navigate = useNavigate();
  const [beans, setBeans] = useState<Bean[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBeans = async () => {
      try {
        const res = await api.api.beans.$get();
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
  }, []);

  const activeBeans = beans.filter((bean) => !bean.isArchived);

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

      {activeBeans.length === 0 ? (
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
          {activeBeans.map((bean) => (
            <Card
              key={bean.id}
              className="hover:border-coffee-primary/30 transition-colors cursor-pointer group"
              onClick={() => navigate(`/logs/new?beanId=${bean.id}`)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="bg-coffee-background w-12 h-12 rounded-2xl flex items-center justify-center group-hover:bg-coffee-primary/10 transition-colors flex-shrink-0 overflow-hidden">
                    {(() => {
                      const countryCode = getCountryCode(bean.origin);
                      const isBlend =
                        !bean.origin ||
                        bean.origin.toLowerCase().includes("ブレンド") ||
                        bean.origin.toLowerCase().includes("blend") ||
                        bean.name.toLowerCase().includes("ブレンド") ||
                        bean.name.toLowerCase().includes("blend");

                      if (!isBlend && countryCode) {
                        return <OriginFlag origin={bean.origin} size={24} />;
                      }

                      return <CoffeeBeansIcon size={24} className="text-coffee-primary" />;
                    })()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-coffee-text truncate">{bean.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {bean.origin && (
                        <span className="text-[10px] text-coffee-secondary bg-coffee-secondary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <OriginFlag origin={bean.origin} size={10} />
                          {bean.origin}
                        </span>
                      )}
                      {bean.purchaseStore && (
                        <span className="text-[10px] text-coffee-secondary bg-coffee-secondary/10 px-2 py-0.5 rounded-full">
                          {bean.purchaseStore}
                        </span>
                      )}
                      {bean.processMethod && (
                        <span className="text-[10px] text-coffee-secondary bg-coffee-secondary/10 px-2 py-0.5 rounded-full">
                          {bean.processMethod}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
                  {bean.roastLevel && <RoastLevelIndicator level={bean.roastLevel} />}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/beans/${bean.id}/edit`);
                      }}
                      className="p-2 text-coffee-secondary hover:text-coffee-primary hover:bg-coffee-secondary/10 rounded-full transition-colors"
                      title="豆を編集"
                    >
                      <Pencil size={16} />
                    </button>
                    <ChevronRight
                      size={18}
                      className="text-coffee-secondary/40 group-hover:text-coffee-primary transition-colors"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BeansList;
