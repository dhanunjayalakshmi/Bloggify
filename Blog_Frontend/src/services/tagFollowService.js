import api from "@/lib/apiClient";

export const getFollowedTags = () => api.get("/tag-follows");
export const toggleTagFollow = (tag) => api.post("/tag-follows", { tag });
