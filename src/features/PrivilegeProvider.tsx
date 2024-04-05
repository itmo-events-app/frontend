import { PrivilegeNames } from '@shared/config/privileges';
import { createContext, useState } from 'react';


class PrivilegeData {
  _name: PrivilegeNames

  constructor(name: PrivilegeNames) {
    this._name = name;
  }

  get name() { return this._name };
}

class PrivilegeContextData {
  _systemPrivileges: Set<PrivilegeData>;

  _eventPrivileges: Map<number, Set<PrivilegeData>>;

  constructor(
    systemPrivileges: Set<PrivilegeData> = new Set(),
    eventPrivileges: Map<number, Set<PrivilegeData>> = new Map()
  ) {
    this._systemPrivileges = systemPrivileges;
    this._eventPrivileges = eventPrivileges;

  }

  get systemPrivileges() {
    return this._systemPrivileges;
  }

  getPrivilegesForEvent(id: number) {
    return this._eventPrivileges.get(id);
  }
}


type PrivilegeContextValue = {
  privilegeContext: PrivilegeContextData,
  setPrivilegeContext: (token: PrivilegeContextData) => void
}

const PrivilegeContext = createContext({} as PrivilegeContextValue);

type Props = {
  context?: PrivilegeContextData,
  children: any
}
/*
 * NOTE: is not stored in localStorage, works like buffer during until page refresh
 */
const PrivilegeContextProvider = (props: Props) => {
  const context = props.context ?? new PrivilegeContextData();
  const [privilegeContext, setPrivilegeContext] = useState(context);

  const contextValue: PrivilegeContextValue = {
    privilegeContext,
    setPrivilegeContext,
  };

  return (
    <PrivilegeContext.Provider value={contextValue}>
      {props.children}
    </PrivilegeContext.Provider>
  );
};

export type { PrivilegeContextValue }
export { PrivilegeData, PrivilegeContextData, PrivilegeContextProvider, PrivilegeContext }
