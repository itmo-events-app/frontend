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
import NotificationsListPage from "@pages/main/NotificationsListPage";

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
    element: <AvailableEventsPage />,
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
    element: <RoleListPage />,
  },
  [AppRoutes.USER_LIST]: {
    path: RoutePaths.userList,
    element: <>User List</>,
  },
  [AppRoutes.NOTIFICATIONS]: {
    path: RoutePaths.notifications,
    element: <NotificationsListPage />,
  },
  [AppRoutes.PROFILE]: {
    path: RoutePaths.profile,
    element: <>Profile</>,
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
