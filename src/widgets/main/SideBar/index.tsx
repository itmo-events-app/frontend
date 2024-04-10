import { DocumentCheck, Home, Menu, Noted, Personal, Users, UserRead, Notebook } from '@shared/ui/icons'
import _Sidebar, { SideBarTab } from './template.tsx'
import { RoutePaths } from '@shared/config/routes.ts';
import { useContext } from 'react';
import { anyPrivilege } from '@features/privileges.ts';
import { PrivilegeNames } from '@shared/config/privileges.ts';
import { PrivilegeData } from '@entities/privilege-context.ts';
import PrivilegeContext from '@features/privilege-context.ts';

type Props = {
  currentPageURL: string,
}

const _tabs: SideBarTab[] = [
  new SideBarTab('Мероприятия', RoutePaths.eventList, <Menu />, anyPrivilege(new Set([
    new PrivilegeData(PrivilegeNames.VIEW_ALL_EVENTS_AND_ACTIVITIES),
  ]))),
  new SideBarTab('Задачи', RoutePaths.taskList, <Notebook />),
  new SideBarTab('Площадки', RoutePaths.placeList, <Home />, anyPrivilege(new Set([
    new PrivilegeData(PrivilegeNames.VIEW_EVENT_PLACE),
  ]))),
  new SideBarTab('Уведомления', RoutePaths.notifications, <Noted />),
  new SideBarTab('Заявки на регистрацию', RoutePaths.requestList, <UserRead />, anyPrivilege(new Set([
    new PrivilegeData(PrivilegeNames.APPROVE_REGISTRATION_REQUEST),
    new PrivilegeData(PrivilegeNames.REJECT_REGISTRATION_REQUEST),
  ]))),
  new SideBarTab('Роли', RoutePaths.roleList, <DocumentCheck />, anyPrivilege(new Set([
    new PrivilegeData(PrivilegeNames.CREATE_ROLE),
    new PrivilegeData(PrivilegeNames.EDIT_ROLE),
    new PrivilegeData(PrivilegeNames.DELETE_ROLE),
  ]))),
  new SideBarTab('Пользователи', RoutePaths.userList, <Users />, anyPrivilege(new Set([
    new PrivilegeData(PrivilegeNames.VIEW_OTHER_USERS_PROFILE),
    new PrivilegeData(PrivilegeNames.ASSIGN_SYSTEM_ROLE),
    new PrivilegeData(PrivilegeNames.REVOKE_SYSTEM_ROLE),
  ]))),
  new SideBarTab('Профиль', RoutePaths.profile, <Personal />),
]


const SideBar = (props: Props) => {
  const { privilegeContext } = useContext(PrivilegeContext);

  return (
    <_Sidebar tabs={_tabs} privilegeContext={privilegeContext} currentPageURL={props.currentPageURL} />
  )
}

export default SideBar
