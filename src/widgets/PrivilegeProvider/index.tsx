import { PrivilegeContextData, PrivilegeData } from '@entities/privilege-context';
import ApiContext from '@features/api-context';
import PrivilegeContext, { PrivilegeContextValue } from '@features/privilege-context';
import { PrivilegeNames } from '@shared/config/privileges';
import { useContext, useEffect, useState } from 'react';

type Props = {
  children: any;
};

const PrivilegeContextProvider = (props: Props) => {
  const { api } = useContext(ApiContext);

  const [systemPrivileges, setSystemPrivileges] = useState<Set<PrivilegeData> | undefined>(undefined);
  const [eventPrivileges, setEventPrivileges] = useState(new Map<number, Set<PrivilegeData>>());
  const [hasOrgRole, setHasOrgRole] = useState(false);

  const [privilegeContext, setPrivilegeContext] = useState(
    new PrivilegeContextData(systemPrivileges, eventPrivileges, hasOrgRole)
  );

  useEffect(() => {
    setPrivilegeContext(new PrivilegeContextData(systemPrivileges, eventPrivileges, hasOrgRole));
  }, [systemPrivileges, eventPrivileges, hasOrgRole]);

  useEffect(() => {
    if (api.isLoggedIn()) {
      updateSystemPrivileges();
    } else {
      resetPrivilegeContext();
    }
  }, [api]);

  function resetPrivilegeContext() {
    setSystemPrivileges(undefined);
    setEventPrivileges(new Map());
    setHasOrgRole(false);
  }

  // useEffect(() => {
  //   console.log(privilegeContext);
  // }, [privilegeContext])

  function updateSystemPrivileges() {
    if (api.isLoggedIn()) {
      api
        .withReauth(() => api.profile.getUserSystemPrivileges())
        .then((r) => {
          const privileges = r.data!.privileges!.map(
            (p) => new PrivilegeData(PrivilegeNames[p.name as keyof typeof PrivilegeNames])
          );
          const orgRoles = r.data!.hasOrganizerRolesResponse ?? false;
          setSystemPrivileges(new Set(privileges));
          setHasOrgRole(orgRoles);
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
          eventPrivileges.set(id, new Set(privileges));
          setEventPrivileges(new Map(eventPrivileges));
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
