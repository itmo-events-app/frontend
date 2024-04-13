import { AppRoutes, RoutePaths } from "@shared/config/routes";
import { Route, Routes, Navigate } from "react-router-dom";
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
import Authenticated from "@widgets/Authenticated";
import Authorized from "@widgets/Authorized";
import UserListPage from "@pages/main/UserList";
import HomeRedirectPage from "@pages/main/HomeRedirectPage";
import { AppRouteProps } from "@features/app-route-props";
import { anyPrivilege } from "@features/privileges";
import { PrivilegeData } from "@entities/privilege-context";
import { PrivilegeNames } from "@shared/config/privileges";
import Authorized from "@features/Authorized";
import PlaceCreationPage from "@pages/main/PlaceCreation";
import PlaceListPage from "@pages/main/PlaceList";
import PlaceDataPage from "@pages/main/PlaceData";

// root urls with privileges
const routes: Record<AppRoutes, AppRouteProps> = {
  [AppRoutes.ROOT]: {
    path: RoutePaths.root,
    authenticated: false,
  },
  [AppRoutes.HOME]: {
    path: RoutePaths.home,
    authenticated: false
  },
  [AppRoutes.REGISTER]: {
    path: RoutePaths.register,
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
  [AppRoutes.PLACE_DATA]: {
    path: RoutePaths.placeData,
    element: <PlaceDataPage />,
  },
  [AppRoutes.PLACE_CREATION]: {
    path: RoutePaths.createPlace,
  },
  [AppRoutes.PLACE_DATA]: {
    path: RoutePaths.placeData,
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
    element: <RegisterPage />,
  },
  [AppRoutes.LOGIN]: {
    element: <LoginPage />,
  },
  [AppRoutes.RESTORE]: {
    element: <RestorePage />,
  },
  [AppRoutes.PASSWORD]: {
    element: <PasswordPage />,
  },
  [AppRoutes.NOTIFY]: {
    element: <NotifyPage />,
  },
  [AppRoutes.EVENT_LIST]: {
    element: <AvailableEventsPage />,
  },
  [AppRoutes.EVENT_CREATION]: {
    element: <EventCreationPage />,
  },
  [AppRoutes.EVENT_DATA]: {
    element: <EventActivitiesPage />,
  },
  [AppRoutes.TASK_LIST]: {
    element: <TaskListPage />,
  },
  [AppRoutes.PLACE_LIST]: {
    element: <PlaceListPage />,
  },
  [AppRoutes.PLACE_DATA]: {
    element: <PlaceDataPage />,
  },
  [AppRoutes.ROLE_LIST]: {
    element: <RoleListPage />,
  },
  [AppRoutes.USER_LIST]: {
    element: <UserListPage />,
  },
  [AppRoutes.NOTIFICATIONS]: {
    element: <NotificationListPage />,
  },
  [AppRoutes.PROFILE]: {
    element: <ProfilePage />,
  },
  [AppRoutes.REQUEST_LIST]: {
    element: <>Request List</>,
  },
  [AppRoutes.NOT_FOUND]: {
    element: <>404 not found</>,
  },
};

export default function AppRouter() {
  const merged = Object.values(AppRoutes).map(k => ({ ...(routes[k]), ...(routeElements[k]) } as AppRouteProps));

  return (
    <Routes>
      {merged.map(({ path, element, authenticated, authorized }: AppRouteProps) => {
        let e = element;
        if (authorized) {
          e = <Authorized whenAllowed={authorized} rejectNavigateTo={RoutePaths.home}>{e}</Authorized>
        }
        if (authenticated) {
          e = <Authenticated rejectNavigateTo={RoutePaths.login}>{e}</Authenticated>
        }
        return <Route key={path} path={path} element={e} />;
      })}
    </Routes>
  );
}
