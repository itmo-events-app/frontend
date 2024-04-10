import { PrivilegeContextData, PrivilegeData } from '@entities/privilege-context';
import PrivilegeContext, { PrivilegeContextValue } from '@features/privilege-context';
import { api } from '@shared/api';
import { PrivilegeNames } from '@shared/config/privileges';
import { useEffect, useState } from 'react';


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

export default PrivilegeContextProvider
