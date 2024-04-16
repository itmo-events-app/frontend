import { Api } from "@entities/api.ts";
import {
  ProfileResponse,
  NotificationSettingsRequest,
  UserChangeNameRequest,
  UserChangePasswordRequest, UserChangeLoginRequest,
} from "@shared/api/generated";

const profileService = {
  getUserInfo: async (api: Api): Promise<ProfileResponse> => {
    const response = await api.withReauth(() => api.profile.getUserInfo());
    return response.data;
  },

  updateNotifications: async (api: Api, notificationSettingsRequest: NotificationSettingsRequest): Promise<void> => {
    await api.withReauth(() => api.profile.updateNotifications(notificationSettingsRequest));
  },

  changeName: async (api: Api, userChangeNameRequest: UserChangeNameRequest): Promise<void> => {
    await api.withReauth(() => api.profile.changeName(userChangeNameRequest));
  },
  changePassword: async (api: Api, userChangePasswordRequest: UserChangePasswordRequest): Promise<void> => {
    await api.withReauth(() => api.profile.changePassword(userChangePasswordRequest));
  },
  changeLogin: async (api: Api, userChangeLoginRequest: UserChangeLoginRequest): Promise<void> => {
    await api.withReauth(() => api.profile.changeLogin(userChangeLoginRequest));
  }
};

export default profileService;
