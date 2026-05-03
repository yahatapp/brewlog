import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent } from "../../components/ui/card";

const AddBean = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    origin: "",
    roastLevel: 3,
    purchaseDate: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement API call
    console.log("Submitting bean:", formData);

    setTimeout(() => {
      setIsLoading(false);
      navigate("/beans");
    }, 1000);
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="origin">産地</Label>
              <Input
                id="origin"
                placeholder="例: エチオピア"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roast">焙煎度 (1: 浅煎り 〜 5: 深煎り)</Label>
              <div className="flex items-center space-x-4">
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
                <span className="font-bold text-coffee-primary w-4">{formData.roastLevel}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">購入日</Label>
              <Input
                id="date"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full rounded-2xl h-12 text-base shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
