import { api } from "@shared/api";
import { TaskResponse } from "@shared/api/generated";
import { DropdownOption } from "@widgets/main/Dropdown";

export const taskService = {

    getTasks: (): Promise<TaskResponse[]> => {
      return Promise.resolve(api
        .withReauth(() => api.task.taskListShowWhereAssignee())
        .then((response) => response.data),
      );
    },

    getEventTasks: ({ id }: { id: number }): Promise<TaskResponse[]> => {
      return Promise.resolve(api
        .withReauth(() => api.task.taskListShowInEventWhereAssignee(id))
        .then((response) => response.data),
      );
    },

    getEventsNames: async () => {
      const response = await api
        .withReauth(() => api.task.taskListShowWhereAssignee());

      const modifiedData = response.data
        .map((el) => ({
          eventName: el.event.eventTitle,
          eventId: el.event.eventId,
        }));

      const uniqueData = modifiedData.filter(
        (value, index, self) =>
          self.findIndex((el) => el.eventName === value.eventName) === index,
      );

      return uniqueData.map((el) => new DropdownOption<string>(el.eventName + " " + el.eventId));
    },

    getActivitiesNames: async () => {
      const response = await api
        .withReauth(() => api.task.taskListShowWhereAssignee());

      return response.data
        .map(el => el.event.activityTitle)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map(el => new DropdownOption<string>(el));
    },

    updateTaskStatus: async ({ newStatus, id }: { newStatus: string; id: number }) => {
      const status: Record<string, string> = {
        "Новое": "NEW",
        "В работе": "IN_PROGRESS",
        "Выполнено": "DONE",
        "Просрочено": "EXPIRED",
      };

      const response = await api
        .withReauth(() => api.task.taskSetStatus(id, status[newStatus]));
      return await (response.data as Promise<unknown>);
    },

  }
;
