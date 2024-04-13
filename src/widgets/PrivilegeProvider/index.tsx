import { PrivilegeContextData, PrivilegeData } from '@entities/privilege-context';
import ApiContext from '@features/api-context';
import PrivilegeContext, { PrivilegeContextValue } from '@features/privilege-context';
import { PrivilegeNames } from '@shared/config/privileges';
import { useContext, useEffect, useState } from 'react';


type Props = {
  children: any
}

const PrivilegeContextProvider = (props: Props) => {
  const [privilegeContext, setPrivilegeContext] = useState(new PrivilegeContextData());
  const { api } = useContext(ApiContext);

  // load privileges on context first render
  useEffect(() => {
    if (api.isLoggedIn()) {
      api.withReauth(() => api.profile.getUserSystemPrivileges())
        .then(r => {
          const privileges = r.data!.privileges!.map(p => new PrivilegeData(PrivilegeNames[p.name as keyof typeof PrivilegeNames]));
          const orgRoles = r.data!.hasOrganizerRolesResponse ?? false;
          setPrivilegeContext(new PrivilegeContextData(new Set(privileges), undefined, orgRoles));
        });
    } else {
      setPrivilegeContext(new PrivilegeContextData())
    }
  }, [api]);


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

export default PrivilegeContextProvider
