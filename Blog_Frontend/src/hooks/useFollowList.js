import { useEffect, useState } from "react";
import api from "@/lib/apiClient";

const useFollowList = (type, userId) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || !type) return;

    const fetchList = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/follows/${type}/${userId}`);
        setUsers(res.data[type] || []);
      } catch (err) {
        console.error("Follow list error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [type, userId]);

  return { users, loading };
};

export default useFollowList;
