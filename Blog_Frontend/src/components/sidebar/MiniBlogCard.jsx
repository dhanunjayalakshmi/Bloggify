import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const MiniBlogCard = ({ blog }) => {
  const { sideHeading, title, author, date, altName } = blog;
  return (
    <Card className="w-full dark:bg-gray-800 dark:text-gray-200">
      <CardContent className="px-4">
        <h2 className="font-semibold mb-4">{sideHeading}</h2>
        {[1, 2, 3, 4, 5]?.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 mb-4 cursor-pointer"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcKpkc_AQKNOt8OsfV3wsfDGOrr-SkE_MRcg&s"
              alt={altName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-sm ">
              <p className="font-medium">{title}</p>
              <p className="text-muted-foreground text-xs">
                {author} - {date}
              </p>
            </div>
          </div>
        ))}
        <Button className="w-full mt-2 text-sm">See More</Button>
      </CardContent>
    </Card>
  );
};

export default MiniBlogCard;
