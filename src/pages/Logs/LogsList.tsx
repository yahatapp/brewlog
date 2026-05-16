import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ClipboardList, Loader2, Star, Calendar } from "lucide-react";
import { useLiff } from "../../hooks/useLiff";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

interface BrewLog {
  id: string;
  beanId: string;
  method: string | null;
  rating: number | null;
  createdAt: string;
  bean: {
    name: string;
  };
}

const LogsList = () => {
  const navigate = useNavigate();
  const { api } = useLiff();
  const [logs, setLogs] = useState<BrewLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!api) return;
      try {
        const res = await api.logs.$get();
        if (res.ok) {
          const data = await res.json();
          setLogs(data as BrewLog[]);
        }
      } catch (err) {
        console.error("Failed to fetch logs", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [api]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
        <h2 className="text-xl font-bold text-coffee-primary">抽出記録履歴</h2>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full"
          onClick={() => navigate("/logs/new")}
        >
          <Plus size={16} className="mr-1" /> 追加
        </Button>
      </div>

      {logs.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            <ClipboardList className="mx-auto text-coffee-secondary/30 mb-4" size={48} />
            <p className="text-coffee-secondary text-sm">記録はまだありません。</p>
            <p className="text-xs text-coffee-secondary/60 mt-2">最高の一杯を記録しましょう！</p>
            <Button className="mt-6 rounded-xl" onClick={() => navigate("/logs/new")}>
              抽出を記録する
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <Card key={log.id} className="hover:border-coffee-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-bold text-coffee-text">{log.bean.name}</h3>
                    <div className="flex items-center text-xs text-coffee-secondary space-x-2">
                      <span className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {formatDate(log.createdAt)}
                      </span>
                      {log.method && <span>• {log.method}</span>}
                    </div>
                  </div>
                  {log.rating && (
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                      <Star size={12} className="fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-xs font-bold text-yellow-700">{log.rating}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogsList;
