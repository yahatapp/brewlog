import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Save, Star, Loader2 } from "lucide-react";
import { useLiff } from "../../hooks/useLiff";
import { Button, cn } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent } from "../../components/ui/card";

interface Bean {
  id: string;
  name: string;
}

const AddLog = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { api } = useLiff();
  const [isLoading, setIsLoading] = useState(false);
  const [beans, setBeans] = useState<Bean[]>([]);
  const [isFetchingBeans, setIsFetchingBeans] = useState(true);

  const [formData, setFormData] = useState({
    beanId: searchParams.get("beanId") || "",
    method: "ハリオV60",
    grindSize: "中挽き",
    waterTemp: 90,
    beanAmount: 15,
    waterAmount: 230,
    rating: 3,
    note: "",
  });

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
        setIsFetchingBeans(false);
      }
    };

    fetchBeans();
  }, [api]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!api || !formData.beanId) return;
    setIsLoading(true);

    try {
      const res = await api.logs.$post({
        json: {
          beanId: formData.beanId,
          method: formData.method,
          grindSize: formData.grindSize,
          waterTemp: formData.waterTemp,
          beanAmount: formData.beanAmount,
          waterAmount: formData.waterAmount,
          rating: formData.rating,
          note: formData.note || null,
        },
      });

      if (res.ok) {
        navigate("/logs");
      } else {
        console.error("Failed to create log", await res.text());
      }
    } catch (err) {
      console.error("Error submitting log", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-xl font-bold text-coffee-primary">抽出を記録する</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bean">コーヒー豆</Label>
              {isFetchingBeans ? (
                <div className="h-10 w-full animate-pulse bg-coffee-secondary/10 rounded-xl" />
              ) : (
                <select
                  id="bean"
                  className="flex h-10 w-full rounded-xl border border-coffee-secondary/20 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee-primary transition-all"
                  value={formData.beanId}
                  onChange={(e) => setFormData({ ...formData, beanId: e.target.value })}
                  required
                >
                  <option value="" disabled>
                    豆を選択してください
                  </option>
                  {beans.map((bean) => (
                    <option key={bean.id} value={bean.id}>
                      {bean.name}
                    </option>
                  ))}
                </select>
              )}
              {beans.length === 0 && !isFetchingBeans && (
                <p className="text-[10px] text-red-500">
                  豆が登録されていません。先に豆を登録してください。
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="method">抽出器具</Label>
                <Input
                  id="method"
                  placeholder="例: ハリオV60"
                  value={formData.method}
                  onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                  className="rounded-xl border-coffee-secondary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grind">挽き目</Label>
                <Input
                  id="grind"
                  placeholder="例: 中挽き"
                  value={formData.grindSize}
                  onChange={(e) => setFormData({ ...formData, grindSize: e.target.value })}
                  className="rounded-xl border-coffee-secondary/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temp">湯温 (℃)</Label>
                <Input
                  id="temp"
                  type="number"
                  value={formData.waterTemp}
                  onChange={(e) =>
                    setFormData({ ...formData, waterTemp: parseInt(e.target.value) || 0 })
                  }
                  className="rounded-xl border-coffee-secondary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beanAmt">豆量 (g)</Label>
                <Input
                  id="beanAmt"
                  type="number"
                  step="0.1"
                  value={formData.beanAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, beanAmount: parseFloat(e.target.value) || 0 })
                  }
                  className="rounded-xl border-coffee-secondary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waterAmt">注水 (ml)</Label>
                <Input
                  id="waterAmt"
                  type="number"
                  value={formData.waterAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, waterAmount: parseInt(e.target.value) || 0 })
                  }
                  className="rounded-xl border-coffee-secondary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>評価</Label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      size={28}
                      className={cn(
                        "transition-colors",
                        star <= formData.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-coffee-secondary/20",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">メモ</Label>
              <textarea
                id="note"
                rows={3}
                className="flex w-full rounded-xl border border-coffee-secondary/20 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coffee-primary transition-all"
                placeholder="味の感想など..."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full rounded-2xl h-12 text-base shadow-lg bg-coffee-primary hover:bg-coffee-primary/90"
          disabled={isLoading || beans.length === 0}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Save size={18} className="mr-2" />
              記録を保存する
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default AddLog;
