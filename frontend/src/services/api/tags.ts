import { Tag } from "@/types/types";
import { apiClient } from "@/config/api";

export const getTagsAPI = async () => {
  const response = await apiClient.get<Tag[]>("/v1/tags");

  return response.data;
};
