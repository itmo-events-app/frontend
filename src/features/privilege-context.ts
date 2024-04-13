import { PrivilegeContextData, PrivilegeData } from "@entities/privilege-context";
import { createContext } from "react";

type PrivilegeContextValue = {
  privilegeContext: PrivilegeContextData,
  resetPrivilegeContext: () => void,
  updateSystemPrivileges: (e: Set<PrivilegeData>, hasOrgRoles: boolean) => void,
  updateEventPrivileges: (id: number, e: Set<PrivilegeData>) => void
}

const PrivilegeContext = createContext({} as PrivilegeContextValue);

export type { PrivilegeContextValue }
export default PrivilegeContext
