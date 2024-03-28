import { AppRoutes, RoutePaths } from "@shared/config/routes";
import { Route, Routes, RouteProps, Navigate } from "react-router-dom";
import LoginPage from "@pages/auth/Login";
import RegisterPage from "@pages/auth/Register";
import RestorePage from "@pages/auth/Restore";
import PasswordPage from "@pages/auth/Password";
import NotifyPage from "@pages/auth/Notification";
import RolesPage from "@pages/main/Roles";
import EventCreationPage from "@pages/main/EventCreation";
import EventActivitiesPage from "@pages/main/EventActivities";

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
  [AppRoutes.ROLES]: {
    path: RoutePaths.roles,
    element: <RolesPage />,
  },
  [AppRoutes.EVENT_CREATION]: {
    path: RoutePaths.createEvent,
    element: <EventCreationPage />,
  },
  [AppRoutes.EVENT_DATA]: {
    path: RoutePaths.eventData,
    element: <EventActivitiesPage />,
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
