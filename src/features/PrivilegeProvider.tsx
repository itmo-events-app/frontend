import { api } from '@shared/api';
import { PrivilegeNames } from '@shared/config/privileges';
import { createContext, useEffect, useState } from 'react';


class PrivilegeData {
  _name: PrivilegeNames

  constructor(name: PrivilegeNames) {
    this._name = name;
  }

  get name() { return this._name };
}

// NOTE: undefined - hasn't been loaded, empty - no privileges
class PrivilegeContextData {
  _systemPrivileges?: Set<PrivilegeData>;
  _eventPrivileges: Map<number, Set<PrivilegeData>>;

  constructor(
    systemPrivileges: Set<PrivilegeData> | undefined = undefined,
    eventPrivileges: Map<number, Set<PrivilegeData>> = new Map()
  ) {
    this._systemPrivileges = systemPrivileges;
    this._eventPrivileges = eventPrivileges;
  }

  isSystemPrivilegesLoaded() {
    return this._systemPrivileges === undefined;
  }

  get systemPrivileges() {
    return this._systemPrivileges;
  }

  isPrivilegesForEventLoaded(id: number) {
    return this._eventPrivileges.get(id) === undefined;
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
  children: any
}

const PrivilegeContextProvider = (props: Props) => {
  const [privilegeContext, setPrivilegeContext] = useState(new PrivilegeContextData());

  // load privileges on context first render
  useEffect(() => {
    api.withReauth(() => api.role.getSystemPrivileges())
      .then(r => {
        const list = r.data.map(p => new PrivilegeData(PrivilegeNames[p.name as keyof typeof PrivilegeNames]));
        setPrivilegeContext(new PrivilegeContextData(new Set(list)));
      });
  }, []);


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
