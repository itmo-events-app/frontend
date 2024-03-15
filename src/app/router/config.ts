// Перечисление роутов
export enum AppRoutes {
  ROOT = "root",
  REGISTER = "register",
  LOGIN = "login",
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
  [AppRoutes.NOT_FOUND]: "*",
};
