import { useContext, useEffect, useState } from "react"
import { TokenContext } from "./TokenProvider"
import { RoutePaths } from "@shared/config/routes";
import { Navigate } from "react-router-dom";

type Props = {
  children: any,
}

const Authorized = (props: Props) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | undefined>();
  const { tokenContext } = useContext(TokenContext);

  useEffect(() => {
    const v = tokenContext.accessToken == null || tokenContext.accessToken == "";
    setIsAuthorized(!v);
  });

  function _Content() {
    if (isAuthorized == null) {
      return <></>
    } else if (isAuthorized) {
      return props.children;
    }
    return <Navigate to={RoutePaths.login} replace />
  }

  return _Content();
}

export default Authorized
