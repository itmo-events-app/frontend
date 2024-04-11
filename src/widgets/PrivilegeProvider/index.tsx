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
          const list = r.data.map(p => new PrivilegeData(PrivilegeNames[p.name as keyof typeof PrivilegeNames]));
          setPrivilegeContext(new PrivilegeContextData(new Set(list)));
        });
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
