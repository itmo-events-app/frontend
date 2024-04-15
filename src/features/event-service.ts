import { Api } from "@entities/api.ts";
import { CreateEventRequest } from "@shared/api/generated";
import { DropdownOption } from "@widgets/main/Dropdown";

export const eventService = {
  createTask: (api: Api, name: string, userId: number) => {
    const request: CreateEventRequest = {
      title: name,
      userId: userId,
    };
    return api.withReauth(() => api.event.addEventByOrganizer(request));
  },

  getUsers: (api: Api) => {
    return async () => {
      const response = await api
        .withReauth(() => api.profile.getAllUsers());
      return response.data.items!.map((e) => new DropdownOption<string>(`${e.name} ${e.surname} (${e.login})`, e!.id!.toString()));
    };
  },
};
