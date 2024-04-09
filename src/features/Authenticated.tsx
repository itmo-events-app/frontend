import { RoutePaths } from "@shared/config/routes";
import { Navigate } from "react-router-dom";
import { getTokenContextData } from "@shared/lib/token";

type Props = {
  children: any,
}

const Authenticated = (props: Props) => {
  const tokenContext = getTokenContextData();

  const isAuthenticated = tokenContext.accessToken != null && tokenContext.accessToken != "";

  function _Content() {
    if (isAuthenticated) {
      return props.children;
    }
    return <Navigate to={RoutePaths.login} replace />
  }

  return _Content();
}

export default Authenticated
