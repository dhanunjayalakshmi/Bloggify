import { useEffect, useState } from "react";
import api from "@/lib/apiClient";

const usePublicStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/public/stats")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to fetch public stats:", err))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
};

export default usePublicStats;
