import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const Suggestions = () => {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <h2 className="font-semibold mb-4">Suggestions</h2>
        {[1, 2, 3]?.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 mb-4 cursor-pointer"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKpkc_AQKNOt8OsfV3wsfDGOrr-SkE_MRcg&s"
              alt="suggestion"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-sm ">
              <p className="font-medium">Mini blog Title</p>
              <p className="text-muted-foreground text-xs">Author - Date</p>
            </div>
          </div>
        ))}
        <Button className="w-full mt-2 text-sm">See More</Button>
      </CardContent>
    </Card>
  );
};

export default Suggestions;
