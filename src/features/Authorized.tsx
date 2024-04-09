import { useEffect, useState, useContext } from "react"
import { Navigate } from "react-router-dom";
import { PrivilegeContext, PrivilegeData } from "./PrivilegeProvider";

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
