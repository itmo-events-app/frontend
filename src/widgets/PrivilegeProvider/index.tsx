import { PrivilegeContextData, PrivilegeData } from '@entities/privilege-context';
import ApiContext from '@features/api-context';
import PrivilegeContext, { PrivilegeContextValue } from '@features/privilege-context';
import { PrivilegeNames } from '@shared/config/privileges';
import { useContext, useEffect, useState } from 'react';

type Props = {
  children: any;
};

const PrivilegeContextProvider = (props: Props) => {
  const [privilegeContext, setPrivilegeContext] = useState(new PrivilegeContextData());
  const { api } = useContext(ApiContext);

  // load privileges on context first render
  useEffect(() => {
    if (api.isLoggedIn()) {
      api
        .withReauth(() => api.profile.getUserSystemPrivileges())
        .then((r) => {
          const privileges = r.data!.privileges!.map(
            (p) => new PrivilegeData(PrivilegeNames[p.name as keyof typeof PrivilegeNames])
          );
          const orgRoles = r.data!.hasOrganizerRolesResponse ?? false;
          updateSystemPrivileges(new Set(privileges), orgRoles);
        });
    } else {
      resetPrivilegeContext();
    }
  }, [api]);

  function resetPrivilegeContext() {
    setPrivilegeContext(new PrivilegeContextData());
  }

  function updateSystemPrivileges(e: Set<PrivilegeData>, hasOrgRoles: boolean) {
    setPrivilegeContext(new PrivilegeContextData(e, privilegeContext.eventPrivileges, hasOrgRoles));
  }

  function updateEventPrivileges(id: number, e: Set<PrivilegeData>) {
    privilegeContext.eventPrivileges.set(id, e);
    setPrivilegeContext(
      new PrivilegeContextData(
        privilegeContext.systemPrivileges,
        privilegeContext.eventPrivileges,
        privilegeContext.hasOrganizerRoles
      )
    );
  }

  const contextValue: PrivilegeContextValue = {
    privilegeContext,
    resetPrivilegeContext,
    updateSystemPrivileges,
    updateEventPrivileges,
  };

  return <PrivilegeContext.Provider value={contextValue}>{props.children}</PrivilegeContext.Provider>;
};

export default PrivilegeContextProvider;
