// Перечисление роутов
export enum AppRoutes {
  ROOT = 'root',
  HOME = 'home',
  REGISTER = 'register',
  LOGIN = 'login',
  RESTORE = 'restore',
  RECOVER_PASSWORD = 'recoverPassword',
  CHANGE_PASSWORD = 'changePassword',
  NOTIFY = 'notify',
  EVENT_DATA = 'eventData',
  EVENT_LIST = 'eventList',
  PLACE_LIST = 'placeList',
  PLACE_DATA = 'placeData',
  ROLE_LIST = 'roleList',
  USER_LIST = 'userList',
  TASK_LIST = 'taskList',
  NOTIFICATIONS = 'notifications',
  PROFILE = 'profile',
  REQUEST_LIST = 'requestList',
  NOT_FOUND = 'notFound',
  CONFIRM_EMAIL = 'confirmEmail',
}

// чтобы не хардкодить шаблонную строку
// RoutePaths.user.replace(RouteParams.USERNAME, username)
export enum RouteParams {
  PLACE_ID = ':place_id',
  USERNAME = ':username',
  EVENT_ID = ':id',
}

export const RoutePaths: Record<AppRoutes, string> = {
  // Будем отрисовывать в зависимости от параметра.
  [AppRoutes.ROOT]: '/',
  [AppRoutes.HOME]: '/home',
  [AppRoutes.REGISTER]: '/register',
  [AppRoutes.LOGIN]: '/login',
  [AppRoutes.RESTORE]: '/restore',
  [AppRoutes.NOTIFY]: '/notify',
  [AppRoutes.RECOVER_PASSWORD]: '/recoverPassword',
  [AppRoutes.CHANGE_PASSWORD]: '/changePassword',
  [AppRoutes.EVENT_LIST]: '/events',
  [AppRoutes.EVENT_DATA]: '/events/' + RouteParams.EVENT_ID,
  [AppRoutes.PLACE_LIST]: '/places',
  [AppRoutes.PLACE_DATA]: '/places/' + RouteParams.PLACE_ID,
  [AppRoutes.ROLE_LIST]: '/roles',
  [AppRoutes.USER_LIST]: '/users',
  [AppRoutes.TASK_LIST]: '/tasks',
  [AppRoutes.NOTIFICATIONS]: '/notifications',
  [AppRoutes.PROFILE]: '/profile',
  [AppRoutes.REQUEST_LIST]: '/requests',
  [AppRoutes.NOT_FOUND]: '*',
  [AppRoutes.CONFIRM_EMAIL]: '/confirmEmail'
};
