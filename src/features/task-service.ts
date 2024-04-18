import { Api } from '@entities/api';
import { PaginatedResponse, TaskListShowWhereAssigneeTaskStatusEnum, TaskResponse } from '@shared/api/generated';
import { DropdownOption } from '@widgets/main/Dropdown';

export const taskService = {
  getAllTasks: (api: Api) => {
    return async (): Promise<TaskResponse[]> => {
      return Promise.resolve(
        api.withReauth(() => api.task.taskListShowWhereAssignee()).then((response) => response.data)
      );
    };
  },

  getFilteredTasks: (
    api: Api,
    eventId?: number,
    assignerId?: number,
    taskStatus?: TaskListShowWhereAssigneeTaskStatusEnum,
    deadlineLowerLimit?: string,
    deadlineUpperLimit?: string,
    page?: number,
    pageSize?: number
  ) => {
    return api
      .withReauth(() =>
        api.task.taskListShowWhereAssignee(
          eventId,
          assignerId,
          taskStatus,
          deadlineLowerLimit,
          deadlineUpperLimit,
          page,
          pageSize
        )
      )
      .then((response): PaginatedResponse => {
        //TODO: Return PaginatedResponse from backend
        //const totalElements: string = response.headers['totalElements'];
        let totalElement = response.data.length;
        if (page !== undefined && pageSize !== undefined)
          totalElement =
            response.data.length < pageSize ? page * pageSize + response.data.length : (page + 1) * pageSize + 1;
        return { total: totalElement, items: response.data };
      });
  },

  getEventTasks: (api: Api) => {
    return async ({ id, userId }: { id: number; userId: number }): Promise<TaskResponse[]> => {
      return Promise.resolve(
        api.withReauth(() => api.task.taskListShowInEvent(id, userId)).then((response) => response.data)
      );
    };
  },

  getAllEventsByAssignee: (api: Api) => {
    return async () => {
      const response = await api.withReauth(() => api.task.taskListShowWhereAssignee());
      const uniqueData = response.data
        .map((el) => ({
          eventName: el.event?.activityTitle ?? el.event?.eventTitle,
          eventId: el.event?.activityId ?? el.event?.eventId,
        }))
        .filter((value, index, self) => self.findIndex((el) => el.eventId === value.eventId) === index);
      return uniqueData.map((el) => new DropdownOption<string>(el.eventName!, el.eventId!.toString()));
    };
  },

  updateTaskStatus: (api: Api) => {
    return async ({ newStatus, id }: { newStatus: string; id: number }) => {
      const status: Record<string, string> = {
        Новое: 'NEW',
        'В работе': 'IN_PROGRESS',
        Выполнено: 'DONE',
        Просрочено: 'EXPIRED',
      };

      const response = await api.withReauth(() => api.task.taskSetStatus(id, status[newStatus]));
      return await (response.data as Promise<unknown>);
    };
  },
};
