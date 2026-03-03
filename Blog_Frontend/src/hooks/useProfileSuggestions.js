import { useEffect, useState } from "react";
import api from "@/lib/apiClient";

const useProfileSuggestions = (limit = 3) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/users/suggestions?limit=${limit}`);
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Profile suggestions error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [limit]);

  return { users, loading };
};

export default useProfileSuggestions;
