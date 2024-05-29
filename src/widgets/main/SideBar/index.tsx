import { DocumentCheck, Home, Menu, Noted, Personal, Users, UserRead, Notebook } from '@shared/ui/icons';
import _Sidebar, { SideBarTab } from './template.tsx';
import { RoutePaths } from '@shared/config/routes.ts';
import { useContext, useEffect, useState } from 'react';
import { anyPrivilege } from '@features/privileges.ts';
import { PrivilegeNames } from '@shared/config/privileges.ts';
import { PrivilegeData } from '@entities/privilege-context.ts';
import PrivilegeContext from '@features/privilege-context.ts';
import { useNavigate } from 'react-router-dom';
import { sharedStart } from '@shared/util.ts';

type Props = {
  currentPageURL: string;
};

type IsVisibleFunc = (x: Set<PrivilegeData>) => boolean;

function isVisibleFuncTrue(_: Set<PrivilegeData>) {
  return true;
}

class SideBarTabE {
  tab: SideBarTab;
  isVisible: IsVisibleFunc;

  constructor(tab: SideBarTab, isVisible: IsVisibleFunc = isVisibleFuncTrue) {
    this.tab = tab;
    this.isVisible = isVisible;
  }
}

const SideBar = (props: Props) => {
  const { privilegeContext } = useContext(PrivilegeContext);
  const navigate = useNavigate();

  const [tabs, setTabs] = useState<SideBarTabE[]>(_getAllTabs());

  function _getAllTabs() {
    return [
      new SideBarTabE(
        new SideBarTab('Мероприятия', RoutePaths.eventList, <Menu />),
        anyPrivilege(new Set([new PrivilegeData(PrivilegeNames.VIEW_ALL_EVENTS)]))
      ),
      new SideBarTabE(
        new SideBarTab('Задачи', RoutePaths.taskList, <Notebook />),
        (_) => privilegeContext.isSystemPrivilegesLoaded() && privilegeContext.hasOrganizerRoles
      ),
      new SideBarTabE(
        new SideBarTab('Площадки', RoutePaths.placeList, <Home />),
        anyPrivilege(new Set([new PrivilegeData(PrivilegeNames.VIEW_EVENT_PLACE)]))
      ),
      new SideBarTabE(new SideBarTab('Уведомления', RoutePaths.notifications, <Noted />)),
      new SideBarTabE(
        new SideBarTab('Заявки на регистрацию', RoutePaths.requestList, <UserRead />),
        anyPrivilege(
          new Set([
            new PrivilegeData(PrivilegeNames.APPROVE_REGISTRATION_REQUEST),
            new PrivilegeData(PrivilegeNames.REJECT_REGISTRATION_REQUEST),
          ])
        )
      ),
      new SideBarTabE(
        new SideBarTab('Роли', RoutePaths.roleList, <DocumentCheck />),
        anyPrivilege(
          new Set([
            new PrivilegeData(PrivilegeNames.CREATE_ROLE),
            new PrivilegeData(PrivilegeNames.EDIT_ROLE),
            new PrivilegeData(PrivilegeNames.DELETE_ROLE),
          ])
        )
      ),
      new SideBarTabE(
        new SideBarTab('Пользователи', RoutePaths.userList, <Users />),
        anyPrivilege(
          new Set([
            new PrivilegeData(PrivilegeNames.VIEW_OTHER_USERS_PROFILE)
          ])
        )
      ),
      new SideBarTabE(new SideBarTab('Профиль', RoutePaths.profile, <Personal />)),
    ];
  }

  useEffect(() => {
    setTabs(_getAllTabs());
  }, [privilegeContext]);

  function _processSelected(tabs: SideBarTabE[], url: string) {
    return tabs.map((e) => {
      const selected = sharedStart([e.tab.url, url]) === e.tab.url;
      e.tab.selected = selected;
      return e;
    });
  }

  function _filterVisible(tabs: SideBarTabE[]) {
    return tabs.filter((tab) => tab.isVisible(privilegeContext.systemPrivileges!));
  }

  function _getTabs(tabs: SideBarTabE[]) {
    return tabs.map((tab) => tab.tab);
  }

  function _onClick(tab: SideBarTab) {
    if (tab.isExpandable()) {
      tab.expanded = !tab.expanded;
      setTabs([...tabs]);
    } else {
      navigate(tab.url);
    }
  }

  return <_Sidebar tabs={_getTabs(_processSelected(_filterVisible(tabs), props.currentPageURL))} onClick={_onClick} />;
};

export default SideBar;
