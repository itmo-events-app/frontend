import { DocumentCheck, Home, Menu, Noted, Personal, UserRead, Users } from '@shared/ui/icons'
import _Sidebar, { SideBarTab } from './template.tsx'
import { RoutePaths } from '@shared/config/routes.ts';
import { sharedStart } from '@shared/util.ts';
import { PrivilegeContext } from '@features/PrivilegeProvider.tsx';
import { useContext } from 'react';

type Props = {
  currentPageURL: string,
}

const _tabs: SideBarTab[] = [
  new SideBarTab('Мероприятия', RoutePaths.eventList, <Menu />),
  // new SideBarTab('Задачи', RoutePaths.taskList, <Noted />),
  new SideBarTab('Площадки', RoutePaths.placeList, <Home />),
  new SideBarTab('Уведомления', RoutePaths.notifications, <Noted />),
  new SideBarTab('Заявки на регистрацию', RoutePaths.registrationRequests, <UserRead />),
  new SideBarTab('Роли', RoutePaths.roleList, <DocumentCheck />),
  new SideBarTab('Пользователи', RoutePaths.userList, <Users />),
  new SideBarTab('Профиль', RoutePaths.profile, <Personal />),
]


const SideBar = (props: Props) => {
  const { privilegeContext } = useContext(PrivilegeContext);

  function processTabs(tabs: SideBarTab[], url: string) {
    return tabs.map(tab => {
      const selected = sharedStart([tab.url, url]) === tab.url;
      tab.selected = selected;
      return tab;
    })
  }

  return (
    <_Sidebar tabs={processTabs(_tabs, props.currentPageURL)} />
  )
}

export default SideBar
