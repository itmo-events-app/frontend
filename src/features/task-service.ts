import { Api } from "@entities/api";
import { TaskResponse } from "@shared/api/generated";
import { DropdownOption } from "@widgets/main/Dropdown";

export const taskService = {

  getTasks: (api: Api) => {
    return async (): Promise<TaskResponse[]> => {
      return Promise.resolve(api
        .withReauth(() => api.task.taskListShowWhereAssignee())
        .then((response) => response.data),
      );
    }
  },

  getEventTasks: (api: Api) => {
    return async ({ id, userId }: { id: number; userId: number }): Promise<TaskResponse[]> => {
      return Promise.resolve(api
        .withReauth(() => api.task.taskListShowInEvent(id, userId))
        .then((response) => response.data),
      );
    }
  },

  getEventsNames: (api: Api) => {
    return async () => {
      const response = await api
        .withReauth(() => api.task.taskListShowWhereAssignee());

      const modifiedData = response.data
        .map((el) => ({
          eventName: el.event?.activityTitle ?? el.event?.eventTitle,
          eventId: el.event?.activityId ?? el.event?.eventId,
        }));

      const uniqueData = modifiedData.filter(
        (value, index, self) =>
          self.findIndex((el) => el.eventName === value.eventName) === index,
      );
      return uniqueData.map((el) => new DropdownOption<string>(el.eventName!, el.eventId!.toString()));
    }
  },

  updateTaskStatus: (api: Api) => {
    return async ({ newStatus, id }: { newStatus: string; id: number }) => {
      const status: Record<string, string> = {
        "Новое": "NEW",
        "В работе": "IN_PROGRESS",
        "Выполнено": "DONE",
        "Просрочено": "EXPIRED",
      };

      const response = await api
        .withReauth(() => api.task.taskSetStatus(id, status[newStatus]));
      return await (response.data as Promise<unknown>);
    }
  },
};
