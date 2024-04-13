import { Api } from "@entities/api.ts";

export const placeService = {
  getPlace: async (api: Api, id: number) => {
    const response = await api
      .withReauth(() => api.place.placeGet(id));
    return response.data;
  },
};
