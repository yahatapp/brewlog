import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useLiff } from "../../hooks/useLiff";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent } from "../../components/ui/card";

const AddBean = () => {
  const navigate = useNavigate();
  const { api } = useLiff();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    origin: "",
    roastLevel: 3,
    purchaseDate: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!api) return;
    setIsLoading(true);

    try {
      const res = await api.beans.$post({
        json: {
          name: formData.name,
          origin: formData.origin || null,
          roastLevel: formData.roastLevel,
          purchaseDate: formData.purchaseDate || null,
        },
      });

      if (res.ok) {
        navigate("/beans");
      } else {
        const errorData = await res.text();
        console.error("Failed to create bean", errorData);
      }
    } catch (err) {
      console.error("Error submitting bean", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoastLabel = (level: number) => {
    const labels = ["浅煎り", "中浅煎り", "中煎り", "中深煎り", "深煎り"];
    return labels[level - 1];
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-xl font-bold text-coffee-primary">豆を登録する</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">豆の名前</Label>
              <Input
                id="name"
                placeholder="例: エチオピア イルガチェフェ"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-xl border-coffee-secondary/20 focus:ring-coffee-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="origin">産地</Label>
              <Input
                id="origin"
                placeholder="例: エチオピア"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className="rounded-xl border-coffee-secondary/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="roast">焙煎度</Label>
                <span className="text-sm font-bold text-coffee-primary">
                  {getRoastLabel(formData.roastLevel)}
                </span>
              </div>
              <div className="px-1">
                <input
                  type="range"
                  id="roast"
                  min="1"
                  max="5"
                  step="1"
                  className="w-full h-2 bg-coffee-secondary/20 rounded-lg appearance-none cursor-pointer accent-coffee-primary"
                  value={formData.roastLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, roastLevel: parseInt(e.target.value) })
                  }
                />
                <div className="flex justify-between mt-2 text-[10px] text-coffee-secondary">
                  <span>浅煎り</span>
                  <span>中煎り</span>
                  <span>深煎り</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">購入日</Label>
              <Input
                id="date"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="rounded-xl border-coffee-secondary/20"
              />
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full rounded-2xl h-12 text-base shadow-lg bg-coffee-primary hover:bg-coffee-primary/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <>
              <Save size={18} className="mr-2" />
              保存する
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default AddBean;
