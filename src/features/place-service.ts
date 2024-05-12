import { Api } from '@entities/api.ts';
import { PlaceRequest, PlaceRequestFormatEnum, PlaceResponse } from '@shared/api/generated';

export const placeService = {
  getPlace: async (api: Api, id: number) => {
    const response = await api
      .withReauth(() => api.place.placeGet(id));
    return response.data;
  },

  deletePlace: async (api: Api, id: number) => {
    const response = await api
      .withReauth(() => api.place.placeDelete(id));
    return response.data;
  },

  getPlaces: (api: Api) => {
    return async (): Promise<PlaceResponse[]> => {
      const response = await api
        .withReauth(() => api.place.getAllOrFilteredPlaces(undefined, 50));
      return response.data;
    };
  },

  getFilteredPlaces: (api: Api) => {
    return async ({ name }: { name: string }): Promise<PlaceResponse[]> => {
      return Promise.resolve(api
        .withReauth(() => api.place.getAllOrFilteredPlaces(undefined, 50, name))
        .then((response) => response.data)
      );
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
    return api.withReauth(() => api.place.placeAdd(request));
  },

  updatePlace: ({ api, id, address, format, room, description, name, latitude, longitude }: {
    api: Api;
    id: number;
    name: string;
    address: string;
    format: PlaceRequestFormatEnum;
    room: string;
    description: string;
    latitude: number;
    longitude: number
  }) => {
    const request: PlaceRequest = {
      name,
      address,
      format,
      room,
      description,
      latitude,
      longitude,
    };
    return api.withReauth(() => api.place.placeEdit(id, request));
  },
};
