import { useEffect, useState } from "react";
import { fetchExploreUsers } from "@/services/userService";
import ExploreUserCard from "@/components/user/ExploreUserCard";

const Section = ({ title, users }) => {
  if (!users?.length) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <div className="grid gap-4">
        {users?.map((user) => (
          <ExploreUserCard key={user?.id} user={user} />
        ))}
      </div>
    </div>
  );
};

const ExplorePeople = () => {
  const [data, setData] = useState({
    suggested: [],
    popular: [],
    active: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchExploreUsers();
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <Section title="Suggested for you" users={data?.suggested} />
      <Section title="Popular authors" users={data?.popular} />
      <Section title="Active writers" users={data?.active} />
    </div>
  );
};

export default ExplorePeople;
