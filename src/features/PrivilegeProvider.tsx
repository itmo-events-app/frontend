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
  _privileges: Set<PrivilegeData>;

  _eventPrivileges: Map<number, Set<PrivilegeData>>;

  constructor(
    privileges: Set<PrivilegeData> = new Set(),
    eventPrivileges: Map<number, Set<PrivilegeData>> = new Map()
  ) {
    this._privileges = privileges;
    this._eventPrivileges = eventPrivileges;

  }

  get privileges() {
    return this._privileges;
  }

  getPrivilegesForEvent(id: number): Set<PrivilegeData> | undefined {
    return this._eventPrivileges.get(id);
  }
}

type PrivilegeContextValue = {
  privilegeContext: PrivilegeContextData,
  setPrivilegeContext: (token: PrivilegeContextData) => void
}

export const TokenContext = createContext({} as PrivilegeContextValue);

/*
 * NOTE: is not stored in localStorage, works like buffer during until page refresh
 */
export const PrivilegeContextProvider = (props: { children: any }) => {
  const [privilegeContext, setPrivilegeContext] = useState(new PrivilegeContextData());

  const contextValue: PrivilegeContextValue = {
    privilegeContext,
    setPrivilegeContext,
  };

  return (
    <TokenContext.Provider value={contextValue}>
      {props.children}
    </TokenContext.Provider>
  );
};

export type { PrivilegeContextValue }
export { PrivilegeContextData }
