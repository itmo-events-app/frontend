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
import { anyPrivilege } from "@features/privileges";
import { PrivilegeNames } from "@shared/config/privileges";
import Authenticated from "@widgets/Authenticated";
import Authorized from "@widgets/Authorized";
import { PrivilegeData } from "@entities/privilege-context";
import UserListPage from "@pages/main/UserList";

const routes: Record<AppRoutes, RouteProps> = {
  [AppRoutes.ROOT]: {
    path: RoutePaths.root,
    element: <Navigate to={RoutePaths.login} />,
  },
  [AppRoutes.REGISTER]: {
    path: RoutePaths.register,
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
    element: <Authenticated>
      <AvailableEventsPage />
    </Authenticated>,
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
    element: <>Place list</>,
  },
  [AppRoutes.ROLE_LIST]: {
    path: RoutePaths.roleList,
    element: <Authenticated>
      <Authorized
        whenAllowed={anyPrivilege(new Set([
          new PrivilegeData(PrivilegeNames.CREATE_ROLE),
          new PrivilegeData(PrivilegeNames.EDIT_ROLE),
          new PrivilegeData(PrivilegeNames.DELETE_ROLE),
        ]))}
        rejectNavigateTo={RoutePaths.eventList}>
        <RoleListPage />
      </Authorized>
    </Authenticated>,
  },
  [AppRoutes.USER_LIST]: {
    path: RoutePaths.userList,
    element: <UserListPage />,
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
