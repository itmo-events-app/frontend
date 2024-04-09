import { Task } from "../model/task.ts";
import { BASE_PATH } from "@shared/api/generated/base.ts";

export const taskService = {

  getTasks: (): Promise<Task[]> => {
    return Promise.resolve(
      fetch(`${BASE_PATH}/api/tasks/where-assignee`, {
        method: "GET",
      })
        .then((response) => response.json() as Promise<Task[]>),
    );
  },

  updateTaskStatus: ({ newStatus, id }: { newStatus: string; id: number }) => {
    const status: Record<string, string> = {
      "Новое": "NEW",
      "В работе": "IN_PROGRESS",
      "Выполнено": "DONE",
      "Просрочено": "EXPIRED",
    };

    return fetch(`${BASE_PATH}/api/tasks/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(status[newStatus]),
    })
      .then((response) => response.json() as Promise<unknown>);
  },

};
