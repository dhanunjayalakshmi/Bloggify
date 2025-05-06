import { Card, CardContent } from "@/components/ui/card";

export default function BlogAnalytics({ analytics }) {
  return (
    <div className="grid gap-4">
      {analytics.map((item) => (
        <Card key={item.id} className="dark:bg-gray-900">
          <CardContent className="p-4 space-y-2">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-muted-foreground">
              Avg Read Time: {item.readTime} mins
            </p>
            <div className="text-sm">
              <p>Traffic:</p>
              <ul className="list-disc ml-4">
                <li>Direct: {item.traffic.direct}</li>
                <li>Search: {item.traffic.search}</li>
                <li>Social: {item.traffic.social}</li>
                <li className="text-muted-foreground italic">
                  Referral: Coming soon
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
