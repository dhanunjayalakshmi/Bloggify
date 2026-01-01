import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/cn";

export default function KpiCard({ icon: Icon, label, value, className }) {
  return (
    <Card className={cn("w-full dark:bg-gray-900 shadow-sm", className)}>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold text-foreground">{value}</p>
        </div>
        {Icon && <Icon className="w-6 h-6 text-primary" />}
      </CardContent>
    </Card>
  );
}
