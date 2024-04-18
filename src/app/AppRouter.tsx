import { AppRoutes, RoutePaths } from '@shared/config/routes';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from '@pages/auth/Login';
import RegisterPage from '@pages/auth/Register';
import RestorePage from '@pages/auth/Restore';
import PasswordPage from '@pages/auth/Password';
import NotifyPage from '@pages/auth/Notification';
import RoleListPage from '@pages/main/RoleList';
import EventListPage from '@pages/main/EventListPage';
import PlaceListPage from '@pages/main/PlaceListPage';
import EventActivitiesPage from '@pages/main/EventData';
import TaskListPage from '@pages/main/TaskList';
import NotificationListPage from '@pages/main/NotificationListPage';
import ProfilePage from '@pages/main/ProfilePage';
import Authenticated from '@widgets/Authenticated';
import Authorized from '@widgets/Authorized';
import UserListPage from '@pages/main/UserList';
import HomeRedirectPage from '@pages/main/HomeRedirectPage';
import RequestListPage from '@pages/main/RequestListPage';
import { AppRouteProps } from '@features/app-route-props';
import { anyPrivilege } from '@features/privileges';
import { PrivilegeData } from '@entities/privilege-context';
import { PrivilegeNames } from '@shared/config/privileges';
import PlaceDataPage from '@pages/main/PlaceData';

// root urls with privileges
const routes: Record<AppRoutes, AppRouteProps> = {
  [AppRoutes.ROOT]: {
    path: RoutePaths.root,
    authenticated: false,
  },
  [AppRoutes.HOME]: {
    path: RoutePaths.home,
    authenticated: false,
  },
  [AppRoutes.REGISTER]: {
    path: RoutePaths.register,
    authenticated: false,
  },
  [AppRoutes.LOGIN]: {
    path: RoutePaths.login,
    authenticated: false,
  },
  [AppRoutes.RESTORE]: {
    path: RoutePaths.restore,
    authenticated: false,
  },
  [AppRoutes.PASSWORD]: {
    path: RoutePaths.password,
    authenticated: false,
  },
  [AppRoutes.NOTIFY]: {
    path: RoutePaths.notify,
    authenticated: false,
  },
  [AppRoutes.EVENT_LIST]: {
    path: RoutePaths.eventList,
    authenticated: true,
    authorized: anyPrivilege(
      new Set([
        new PrivilegeData(PrivilegeNames.VIEW_ALL_EVENTS)
      ])
    ),
  },
  [AppRoutes.EVENT_DATA]: {
    path: RoutePaths.eventData,
    authenticated: true,
    authorized: anyPrivilege(
      new Set([
        new PrivilegeData(PrivilegeNames.VIEW_ALL_EVENTS)
      ])
    ),
  },
  [AppRoutes.TASK_LIST]: {
    path: RoutePaths.taskList,
    authenticated: true,
    authorized: anyPrivilege(
      new Set([
        new PrivilegeData(PrivilegeNames.VIEW_ALL_EVENT_TASKS),
        new PrivilegeData(PrivilegeNames.DECLINE_TASK_EXECUTION),
        new PrivilegeData(PrivilegeNames.ASSIGN_SELF_AS_TASK_EXECUTOR)
      ])
    ),
  },
  [AppRoutes.PLACE_LIST]: {
    path: RoutePaths.placeList,
    authenticated: true,
    authorized: anyPrivilege(
      new Set([
        new PrivilegeData(PrivilegeNames.VIEW_EVENT_PLACE),
        new PrivilegeData(PrivilegeNames.EDIT_EVENT_VENUE),
        new PrivilegeData(PrivilegeNames.CREATE_EVENT_VENUE),
      ])
    ),
  },
  [AppRoutes.PLACE_DATA]: {
    path: RoutePaths.placeData,
    authenticated: true,
    authorized: anyPrivilege(
      new Set([
        new PrivilegeData(PrivilegeNames.VIEW_EVENT_PLACE),
        new PrivilegeData(PrivilegeNames.VIEW_ROUTE_BETWEEN_ROOMS)
      ])
    ),
  },
  [AppRoutes.ROLE_LIST]: {
    path: RoutePaths.roleList,
    authenticated: true,
    authorized: anyPrivilege(
      new Set([
        new PrivilegeData(PrivilegeNames.CREATE_ROLE),
        new PrivilegeData(PrivilegeNames.EDIT_ROLE),
        new PrivilegeData(PrivilegeNames.DELETE_ROLE),
      ])
    ),
  },
  [AppRoutes.USER_LIST]: {
    path: RoutePaths.userList,
    authenticated: true,
  },
  [AppRoutes.NOTIFICATIONS]: {
    path: RoutePaths.notifications,
    authenticated: true,
  },
  [AppRoutes.PROFILE]: {
    path: RoutePaths.profile,
    authenticated: true,
    authorized: anyPrivilege(
      new Set([
        new PrivilegeData(PrivilegeNames.MODIFY_PROFILE_DATA)
      ])
    ),
  },
  [AppRoutes.REQUEST_LIST]: {
    path: RoutePaths.requestList,
    authenticated: true,
    authorized: anyPrivilege(
      new Set([
        new PrivilegeData(PrivilegeNames.APPROVE_REGISTRATION_REQUEST),
        new PrivilegeData(PrivilegeNames.REJECT_REGISTRATION_REQUEST),
      ])
    ),
  },
  [AppRoutes.NOT_FOUND]: {
    path: RoutePaths.notFound,
    authenticated: true,
  },
};

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
    element: <EventListPage />,
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
    element: <RequestListPage />,
  },
  [AppRoutes.NOT_FOUND]: {
    element: <>404 not found</>,
  },
};

export default function AppRouter() {
  const merged = Object.values(AppRoutes).map((k) => ({ ...routes[k], ...routeElements[k] }) as AppRouteProps);

  return (
    <Routes>
      {merged.map(({ path, element, authenticated, authorized }: AppRouteProps) => {
        let e = element;
        if (authorized) {
          e = (
            <Authorized whenAllowed={authorized} rejectNavigateTo={RoutePaths.home}>
              {e}
            </Authorized>
          );
        }
        if (authenticated) {
          e = <Authenticated rejectNavigateTo={RoutePaths.login}>{e}</Authenticated>;
        }
        return <Route key={path} path={path} element={e} />;
      })}
    </Routes>
  );
}
