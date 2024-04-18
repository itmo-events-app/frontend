import { Api } from '@entities/api.ts';
import {
  CreateEventRequest,
  GetAllOrFilteredEventsFormatEnum,
  GetAllOrFilteredEventsStatusEnum,
} from '@shared/api/generated';

export const eventService = {
  createEvent: (api: Api, name: string, userId: number) => {
    const request: CreateEventRequest = {
      title: name,
      userId: userId,
    };
    return api.withReauth(() => api.event.addEventByOrganizer(request)).then((response) => response.status === 201);
  },

  getUsers: (api: Api) => {
    return api.withReauth(() => api.profile.getAllUsers()).then((response) => response.data);
  },

  getFilteredEvents: (
    api: Api,
    page?: number,
    size?: number,
    parentId?: number,
    title?: string,
    startDate?: string,
    endDate?: string,
    status?: GetAllOrFilteredEventsStatusEnum,
    format?: GetAllOrFilteredEventsFormatEnum
  ) => {
    return api
      .withReauth(() =>
        api.event.getAllOrFilteredEvents(page, size, parentId, title, startDate, endDate, status, format)
      )
      .then((response) => response.data);
  },
};
