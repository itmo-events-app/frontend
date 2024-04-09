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

    getEventsNames: async () => {
      const response = await api
        .withReauth(() => api.task.taskListShowWhereAssignee());

      return response.data
        .map(el => el.event.eventTitle)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map(el => new DropdownOption<string>(el))
    },

    getActivitiesNames: async () => {
      const response = await api
        .withReauth(() => api.task.taskListShowWhereAssignee());

      return response.data
        .map(el => el.event.activityTitle)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map(el => new DropdownOption<string>(el))
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

    getEventTasks:
      ({ id }: { id: number }): Promise<TaskResponse[]> => {
        return Promise.resolve(api
          .withReauth(() => api.task.taskListShowInEventWhereAssignee(id))
          .then((response) => response.data),
        );
      },

  }
;
