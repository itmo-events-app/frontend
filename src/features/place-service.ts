import { Api } from "@entities/api.ts";
import { PlaceRequest, PlaceRequestFormatEnum, PlaceResponse } from "@shared/api/generated";

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
    };
  },

  createPlace: (api: Api, name: string, address: string, format: PlaceRequestFormatEnum, room: string, description: string, lat: number, long: number) => {
    const request: PlaceRequest = {
      name: name,
      address: address,
      format: format,
      room: room,
      description: description,
      latitude: lat,
      longitude: long,
    };

    api.withReauth(() => api.place.placeAdd(request));
  },
};
