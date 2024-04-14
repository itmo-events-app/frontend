import { PrivilegeData } from '@entities/privilege-context';
import { AppRouteProps } from '@features/app-route-props';
import PrivilegeContext from '@features/privilege-context';
import { AppRoutes, RoutePaths } from '@shared/config/routes';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  routes: Record<AppRoutes, AppRouteProps>;
};

// awaits until system privileges are loaded to select which page to load
function HomeRedirectPage(props: Props) {
  const { privilegeContext } = useContext(PrivilegeContext);
  const navigate = useNavigate();

  function _isAuthPass(authorized: ((x: Set<PrivilegeData>) => boolean) | undefined) {
    return authorized === undefined || authorized(privilegeContext.systemPrivileges!);
  }

  function _calcUrlPath(): string {
    if (_isAuthPass(props.routes.requestList.authorized)) {
      return props.routes.requestList.path!;
    }
    if (_isAuthPass(props.routes.eventList.authorized)) {
      return props.routes.eventList.path!;
    }
    return RoutePaths.login;
  }

  useEffect(() => {
    if (privilegeContext.isSystemPrivilegesLoaded()) {
      navigate(_calcUrlPath(), { replace: true });
    }
  }, [privilegeContext]);

  return <></>;
}

export default HomeRedirectPage;
