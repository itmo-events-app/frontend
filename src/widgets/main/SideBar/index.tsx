import { DocumentCheck, Home, Menu, Noted, Personal, Users } from '@shared/ui/icons'
import _Sidebar, { SideBarTab } from './template.tsx'
import { RoutePaths } from '@shared/config/routes.ts';
import { PrivilegeContext } from '@features/PrivilegeProvider.tsx';
import { useContext } from 'react';
import { anyPrivilege } from '@features/privileges.ts';
import { PrivilegeNames } from '@shared/config/privileges.ts';

type Props = {
  currentPageURL: string,
}

const _tabs: SideBarTab[] = [
  new SideBarTab('Мероприятия', RoutePaths.eventList, <Menu />, anyPrivilege(new Set([
    PrivilegeNames.VIEW_ALL_EVENTS_AND_ACTIVITIES,
  ]))),
  new SideBarTab('Задачи', RoutePaths.taskList, <Noted />),
  new SideBarTab('Площадки', RoutePaths.placeList, <Home />, anyPrivilege(new Set([
    PrivilegeNames.VIEW_EVENT_PLACE,
  ]))),
  new SideBarTab('Уведомления', RoutePaths.notifications, <Noted />),
  new SideBarTab('Роли', RoutePaths.roleList, <DocumentCheck />, anyPrivilege(new Set([
    PrivilegeNames.CREATE_ROLE,
    PrivilegeNames.EDIT_ROLE,
    PrivilegeNames.DELETE_ROLE,
  ]))),
  new SideBarTab('Пользователи', RoutePaths.userList, <Users />, anyPrivilege(new Set([
    PrivilegeNames.VIEW_OTHER_USERS_PROFILE,
    PrivilegeNames.ASSIGN_SYSTEM_ROLE,
    PrivilegeNames.REVOKE_SYSTEM_ROLE,
  ]))),
  new SideBarTab('Профиль', RoutePaths.profile, <Personal />),
]


const SideBar = (props: Props) => {
  const { privilegeContext } = useContext(PrivilegeContext);

  const systemPrivileges = new Set([...privilegeContext.privileges].map(data => data.name));

  return (
    <_Sidebar tabs={_tabs} systemPrivileges={systemPrivileges} currentPageURL={props.currentPageURL} />
  )
}

export default SideBar
