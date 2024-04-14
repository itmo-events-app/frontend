import { PrivilegeData } from '@entities/privilege-context';
import { RouteProps } from 'react-router-dom';

interface SecuredRouteProps {
  path?: string;
  authenticated?: boolean;
  authorized?: (x: Set<PrivilegeData>) => boolean;
}

type AppRouteProps = SecuredRouteProps & RouteProps;

export type { AppRouteProps };
