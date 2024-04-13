import { PrivilegeContextData } from "@entities/privilege-context";
import { createContext } from "react";

type PrivilegeContextValue = {
  privilegeContext: PrivilegeContextData,
  setPrivilegeContext: (token: PrivilegeContextData) => void
}

const PrivilegeContext = createContext({} as PrivilegeContextValue);

export type { PrivilegeContextValue }
export default PrivilegeContext
