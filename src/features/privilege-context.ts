import { PrivilegeContextData } from '@entities/privilege-context';
import { createContext } from 'react';

type PrivilegeContextValue = {
  privilegeContext: PrivilegeContextData;
  resetPrivilegeContext: () => void;
  updateSystemPrivileges: () => void;
  updateEventPrivileges: (id: number) => void;
};

const PrivilegeContext = createContext({} as PrivilegeContextValue);

export type { PrivilegeContextValue };
export default PrivilegeContext;
