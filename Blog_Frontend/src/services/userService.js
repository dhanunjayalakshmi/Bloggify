import api from "@/lib/apiClient";

export const fetchExploreUsers = () => {
  return api.get("/users/explore");
};
