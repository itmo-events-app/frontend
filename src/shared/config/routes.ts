// Перечисление роутов
export enum AppRoutes {
  ROOT = "root",
  REGISTER = "register",
  LOGIN = "login",
  RESTORE = "restore",
  PASSWORD = "password",
  NOTIFY = "notify",
  EVENT_CREATION = "createEvent",
  EVENT_DATA = "eventData",
  EVENT_LIST = "eventList",
  PLACE_LIST = "placeList",
  PLACE_CREATION = "createPlace",
  ROLE_LIST = "roleList",
  USER_LIST = "userList",
  TASK_LIST = "taskList",
  NOTIFICATIONS = "notifications",
  PROFILE = "profile",
  REQUEST_LIST = "requestList",
  NOT_FOUND = "notFound",
}

// чтобы не хардкодить шаблонную строку
// RoutePaths.user.replace(RouteParams.USERNAME, username)
export enum RouteParams {
  PLACE_ID = ":place_id",
  USERNAME = ":username",
}

export const RoutePaths: Record<AppRoutes, string> = {
  // Будем отрисовывать в зависимости от параметра.
  [AppRoutes.ROOT]: "/",
  [AppRoutes.REGISTER]: "/register",
  [AppRoutes.LOGIN]: "/login",
  [AppRoutes.RESTORE]: "/restore",
  [AppRoutes.NOTIFY]: "/notify",
  [AppRoutes.PASSWORD]: "/password",
  [AppRoutes.EVENT_LIST]: "/events",
  [AppRoutes.EVENT_CREATION]: "/events/create",
  [AppRoutes.EVENT_DATA]: "/events/event",
  [AppRoutes.PLACE_LIST]: "/places",
  [AppRoutes.PLACE_CREATION]: "/places/create",
  [AppRoutes.ROLE_LIST]: "/roles",
  [AppRoutes.USER_LIST]: "/users",
  [AppRoutes.TASK_LIST]: "/tasks",
  [AppRoutes.NOTIFICATIONS]: "/notifications",
  [AppRoutes.PROFILE]: "/profile",
  [AppRoutes.REQUEST_LIST]: "/requests",
  [AppRoutes.NOT_FOUND]: "*"
};
