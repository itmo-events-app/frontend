import { useEffect, useState } from "react"
import { RoutePaths } from "@shared/config/routes";
import { Navigate } from "react-router-dom";
import { getTokenContextData } from "@shared/lib/token";

type Props = {
  children: any,
}

const Authenticated = (props: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>();
  const tokenContext = getTokenContextData();

  useEffect(() => {
    const v = tokenContext.accessToken == null || tokenContext.accessToken == "";
    setIsAuthenticated(!v);
  });

  function _Content() {
    if (isAuthenticated == null) {
      return <></>
    } else if (isAuthenticated) {
      return props.children;
    }
    return <Navigate to={RoutePaths.login} replace />
  }

  return _Content();
}

export default Authenticated
