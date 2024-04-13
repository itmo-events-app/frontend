import { PrivilegeData } from "@entities/privilege-context";
import PrivilegeContext from "@features/privilege-context";
import { useContext } from "react"
import { Navigate } from "react-router-dom";

type Props = {
  children: any,
  whenAllowed: (x: Set<PrivilegeData>) => boolean,
  rejectNavigateTo: string,
}

const Authorized = (props: Props) => {
  const { privilegeContext } = useContext(PrivilegeContext);

  let isAuthorized = true;

  if (privilegeContext.isSystemPrivilegesLoaded()) {
    isAuthorized = props.whenAllowed(privilegeContext.systemPrivileges!);
  }

  function _Content() {
    if (isAuthorized) {
      return props.children;
    }
    return <Navigate to={props.rejectNavigateTo} replace />
  }

  return _Content();
}

export default Authorized
