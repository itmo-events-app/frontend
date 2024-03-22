// Перечисление роутов
export enum AppRoutes {
  ROOT = "root",
  REGISTER = "register",
  LOGIN = "login",
  RESTORE = "restore",
  PASSWORD = "password",
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
  [AppRoutes.PASSWORD]: "/password",
  [AppRoutes.NOT_FOUND]: "*",
};
