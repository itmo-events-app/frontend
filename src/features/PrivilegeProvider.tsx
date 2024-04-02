import { createContext, useState } from 'react';

class PrivilegeData {
  _id: number;
  _name: string;

  constructor(id: number, name: string) {
    this._id = id;
    this._name = name;
  }

  get id() { return this._id; }
  get name() { return this._name };
}

class PrivilegeContextData {
  _privileges: PrivilegeData[];

  _eventPrivileges: Map<number, PrivilegeData[]>;

  constructor(
    privileges: PrivilegeData[] = [],
    eventPrivileges: Map<number, PrivilegeData[]> = new Map()
  ) {
    this._privileges = privileges;
    this._eventPrivileges = eventPrivileges;

  }

  get privileges() {
    return this._privileges;
  }

  getPrivilegesForEvent(id: number): PrivilegeData[] | undefined {
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
