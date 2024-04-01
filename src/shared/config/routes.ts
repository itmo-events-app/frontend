// Перечисление роутов
export enum AppRoutes {
  ROOT = "root",
  REGISTER = "register",
  LOGIN = "login",
  RESTORE = "restore",
  PASSWORD = "password",
  NOTIFY = "notify",
  ROLES = "roles",
  EVENT_CREATION = "createEvent",
  EVENT_DATA = "eventData",
  EVENT_PART = "eventParticipants",
  NOT_FOUND = "notFound",
}

// чтобы не хардкодить шаблонную строку
// RoutePaths.user.replace(RouteParams.USERNAME, username)
export enum RouteParams {
  POST_ID = ":id",
  USERNAME = ":username",
}

export const RoutePaths: Record<AppRoutes, string> = {
  [AppRoutes.ROOT]: "/",
  [AppRoutes.REGISTER]: "/register",
  [AppRoutes.LOGIN]: "/login",
  [AppRoutes.RESTORE]: "/restore",
  [AppRoutes.NOTIFY]: "/notify",
  [AppRoutes.PASSWORD]: "/password",
  [AppRoutes.ROLES]: "/roles",
  [AppRoutes.EVENT_CREATION]: "/events/create",
  [AppRoutes.EVENT_PART]: "/events/participants",
  [AppRoutes.EVENT_DATA]: "/events/event",
  [AppRoutes.NOT_FOUND]: "*"
};
