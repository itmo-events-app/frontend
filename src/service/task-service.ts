import { api } from "@shared/api";
import { TaskResponse } from "@shared/api/generated";

export const taskService = {

  getTasks: (): Promise<TaskResponse[]> => {
    return Promise.resolve(api
      .withReauth(() => api.task.taskListShowWhereAssignee())
      .then((response) => response.data),
    );
  },

  updateTaskStatus: ({ newStatus, id }: { newStatus: string; id: number }) => {
    const status: Record<string, string> = {
      "Новое": "NEW",
      "В работе": "IN_PROGRESS",
      "Выполнено": "DONE",
      "Просрочено": "EXPIRED",
    };

    return api
      .withReauth(() => api.task.taskSetStatus(id, status[newStatus]))
      .then((response) => response.data as Promise<unknown>);
  },

};
