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
    updateSystemPrivileges();
  }, [api]);

  function resetPrivilegeContext() {
    setPrivilegeContext(new PrivilegeContextData());
  }

  function updateSystemPrivileges() {
    if (api.isLoggedIn()) {
      api
        .withReauth(() => api.profile.getUserSystemPrivileges())
        .then((r) => {
          const privileges = r.data!.privileges!.map(
            (p) => new PrivilegeData(PrivilegeNames[p.name as keyof typeof PrivilegeNames])
          );
          const orgRoles = r.data!.hasOrganizerRolesResponse ?? false;
          setPrivilegeContext(new PrivilegeContextData(new Set(privileges), privilegeContext.eventPrivileges, orgRoles));
        });
    }
  }

  function updateEventPrivileges(id: number) {
    if (api.isLoggedIn()) {
      api
        .withReauth(() => api.profile.getUserEventPrivileges(id))
        .then((r) => {
          const privileges = r.data!.map(
            (p) => new PrivilegeData(PrivilegeNames[p.name as keyof typeof PrivilegeNames])
          );
          privilegeContext.eventPrivileges.set(id, new Set(privileges));
          setPrivilegeContext(new PrivilegeContextData(
            privilegeContext.systemPrivileges,
            privilegeContext.eventPrivileges,
            privilegeContext.hasOrganizerRoles
          ));
        });
    }
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
