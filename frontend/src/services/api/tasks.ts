import { TCreateFormSchema, TEditFormSchema } from "@/schemas/task-schema";
import { useAuthStore } from "@/stores/auth-store";
import { Task } from "@/types/types";
import { apiClient } from "@/config/api";

export const getTasksOnUserAPI = async () => {
  const token = useAuthStore.getState().token;

  const response = await apiClient.get<Task[]>("/v1/tasks/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createTaskAPI = async (data: {
  formData: TCreateFormSchema;
  token: string | null;
}) => {
  const { formData, token } = data;

  await apiClient.post("/v1/tasks", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateTaskAPI = async (data: {
  formData: TEditFormSchema;
  taskId: number;
  token: string | null;
}) => {
  const { formData, token, taskId } = data;

  await apiClient.put(`/v1/tasks/${taskId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteTaskAPI = async (data: {
  taskId: number;
  token: string | null;
}) => {
  const { token, taskId } = data;

  await apiClient.delete(`/v1/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
