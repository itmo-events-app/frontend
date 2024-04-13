import { Api } from "@entities/api.ts";
import { PlaceResponse } from "@shared/api/generated";

export const placeService = {
  getPlace: async (api: Api, id: number) => {
    const response = await api
      .withReauth(() => api.place.placeGet(id));
    return response.data;
  },

  getPlaces: (api: Api) => {
    return async (): Promise<PlaceResponse[]> => {
      const response = await api
        .withReauth(() => api.place.getAllOrFilteredPlaces());
      return response.data;
    }
  },
};
