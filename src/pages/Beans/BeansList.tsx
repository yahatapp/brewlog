import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

const BeansList = () => {
  const navigate = useNavigate();
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-coffee-primary">コーヒー豆一覧</h2>
        <Button size="sm" variant="outline" onClick={() => navigate("/beans/new")}>
          <Plus size={16} className="mr-1" /> 追加
        </Button>
      </div>
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-coffee-secondary text-sm">登録されている豆はありません。</p>
          <p className="text-xs text-coffee-secondary/60 mt-2">お気に入りの豆を登録しましょう！</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BeansList;
