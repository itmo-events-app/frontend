import { AppRoutes, RoutePaths } from "@shared/config/routes";
import { Route, Routes, RouteProps, Navigate } from "react-router-dom";
import LoginPage from "@pages/auth/Login";
import RegisterPage from "@pages/auth/Register";
import RestorePage from "@pages/auth/Restore";
import PasswordPage from "@pages/auth/Password";
import NotifyPage from "@pages/auth/Notification";
import RoleListPage from "@pages/main/RoleList";
import AvailableEventsPage from "@pages/main/AvailableEvents";
import EventCreationPage from "@pages/main/EventCreation";
import EventActivitiesPage from "@pages/main/EventData";
import TaskListPage from "@pages/main/TaskList";
import NotificationListPage from "@pages/main/NotificationListPage";
import ProfilePage from "@pages/main/ProfilePage";
import Authorized from "@features/Authorized";
import PlaceCreationPage from "@pages/main/PlaceCreation";
import PlaceListPage from "@pages/main/PlaceList";

const routes: Record<AppRoutes, RouteProps> = {
  [AppRoutes.ROOT]: {
    path: RoutePaths.root,
    element: <Navigate to={RoutePaths.login} />,
  },
  [AppRoutes.REGISTER]: {
    path: RoutePaths.register,
<<<<<<< Updated upstream
=======
    authenticated: false
  },
  [AppRoutes.LOGIN]: {
    path: RoutePaths.login,
    authenticated: false
  },
  [AppRoutes.RESTORE]: {
    path: RoutePaths.restore,
    authenticated: false
  },
  [AppRoutes.PASSWORD]: {
    path: RoutePaths.password,
    authenticated: false
  },
  [AppRoutes.NOTIFY]: {
    path: RoutePaths.notify,
    authenticated: false
  },
  [AppRoutes.EVENT_LIST]: {
    path: RoutePaths.eventList,
    authenticated: true
  },
  [AppRoutes.EVENT_CREATION]: {
    path: RoutePaths.createEvent,
    authenticated: true
  },
  [AppRoutes.EVENT_DATA]: {
    path: RoutePaths.eventData,
    authenticated: true
  },
  [AppRoutes.TASK_LIST]: {
    path: RoutePaths.taskList,
    authenticated: true
  },
  [AppRoutes.PLACE_LIST]: {
    path: RoutePaths.placeList,
    authenticated: true
  },

  [AppRoutes.ROLE_LIST]: {
    path: RoutePaths.roleList,
    authenticated: true,
    authorized: anyPrivilege(new Set([
      new PrivilegeData(PrivilegeNames.CREATE_ROLE),
      new PrivilegeData(PrivilegeNames.EDIT_ROLE),
      new PrivilegeData(PrivilegeNames.DELETE_ROLE),
    ])),
  },
  [AppRoutes.USER_LIST]: {
    path: RoutePaths.userList,
    authenticated: true
  },
  [AppRoutes.NOTIFICATIONS]: {
    path: RoutePaths.notifications,
    authenticated: true
  },
  [AppRoutes.PROFILE]: {
    path: RoutePaths.profile,
    authenticated: true
  },
  [AppRoutes.REQUEST_LIST]: {
    path: RoutePaths.requestList,
    authenticated: true
  },
  [AppRoutes.NOT_FOUND]: {
    path: RoutePaths.notFound,
    authenticated: true
  },
}

// root elements
const routeElements: Record<AppRoutes, AppRouteProps> = {
  [AppRoutes.ROOT]: {
    element: <Navigate to={RoutePaths.login} />,
  },
  [AppRoutes.HOME]: {
    element: <HomeRedirectPage routes={routes} />,
  },
  [AppRoutes.REGISTER]: {
>>>>>>> Stashed changes
    element: <RegisterPage />,
  },
  [AppRoutes.LOGIN]: {
    path: RoutePaths.login,
    element: <LoginPage />,
  },
  [AppRoutes.RESTORE]: {
    path: RoutePaths.restore,
    element: <RestorePage />,
  },
  [AppRoutes.PASSWORD]: {
    path: RoutePaths.password,
    element: <PasswordPage />,
  },
  [AppRoutes.NOTIFY]: {
    path: RoutePaths.notify,
    element: <NotifyPage />,
  },
  [AppRoutes.EVENT_LIST]: {
    path: RoutePaths.eventList,
    element: <AvailableEventsPage />,
    // element: <Authorized><AvailableEventsPage /></Authorized>,
  },
  [AppRoutes.EVENT_CREATION]: {
    path: RoutePaths.createEvent,
    element: <EventCreationPage />,
  },
  [AppRoutes.EVENT_DATA]: {
    path: RoutePaths.eventData,
    element: <EventActivitiesPage />,
  },
  [AppRoutes.TASK_LIST]: {
    path: RoutePaths.taskList,
    element: <TaskListPage />,
  },
  [AppRoutes.PLACE_LIST]: {
    path: RoutePaths.placeList,
    element: <PlaceListPage />,
  },
  [AppRoutes.PLACE_CREATION]: {
    path: RoutePaths.createPlace,
    element: <PlaceCreationPage />,
  },
  [AppRoutes.ROLE_LIST]: {
    path: RoutePaths.roleList,
    element: <RoleListPage />,
  },
  [AppRoutes.USER_LIST]: {
    path: RoutePaths.userList,
    element: <>User List</>,
  },
  [AppRoutes.NOTIFICATIONS]: {
    path: RoutePaths.notifications,
    element: <NotificationListPage />,
  },
  [AppRoutes.PROFILE]: {
    path: RoutePaths.profile,
    element: <ProfilePage />,
  },
  [AppRoutes.REQUEST_LIST]: {
    path: RoutePaths.requestList,
    element: <>Request List</>,
  },
  [AppRoutes.NOT_FOUND]: {
    path: RoutePaths.notFound,
    element: <>404 not found</>,
  },
};

export default function AppRouter() {
  return (
    <Routes>
      {Object.values(routes).map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Routes>
  );
}
