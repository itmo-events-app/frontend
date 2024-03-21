import Login from "@pages/Login";
import { AppRoutes, RoutePaths } from "./config";
import { Route, Routes, RouteProps } from "react-router-dom";

const routes: Record<AppRoutes, RouteProps> = {
  [AppRoutes.ROOT]: {
    path: RoutePaths.root,
    element: <div>Root</div>,
  },
  [AppRoutes.REGISTER]: {
    path: RoutePaths.register,
    element: <div>Register</div>,
  },
  [AppRoutes.LOGIN]: {
    path: RoutePaths.login,
    element: <Login/>,
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
