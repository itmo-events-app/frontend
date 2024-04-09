import { uid } from 'uid'
import styles from './index.module.css'
import { RoleModel } from '@entities/role'
import { ArrowDown, MenuVertical } from '@shared/ui/icons'
import { appendClassName } from '@shared/util'
import { PrivilegeModel } from '@entities/privilege'

class RoleElement {
  entry: RoleModel;
  expanded: boolean;

  constructor(entry: RoleModel, expanded: boolean = false) {
    this.entry = entry;
    this.expanded = expanded;
  }
}

type Props = {
  roles: RoleElement[],
  setRoles: React.Dispatch<React.SetStateAction<RoleElement[]>>,
  onMenuClick?: (role: RoleModel, e: React.MouseEvent) => void,
}

function RoleList(props: Props) {
  function _expand(tab: RoleElement) {
    return () => {
      tab.expanded = !tab.expanded;
      props.setRoles([...props.roles]);
    }
  }

  function _createPrivilege(privileges: PrivilegeModel) {
    return (
      <div key={uid()} className={styles.privilege}>
        <div className={styles.privilege_name}>
          {privileges.name}
        </div>
        <div className={styles.privilege_description}>
          {privileges.description}
        </div>
      </div>
    )
  }

  function _createPrivilegeList(privileges: PrivilegeModel[]) {
    const res = []
    for (const priv of privileges) {
      res.push(_createPrivilege(priv));
    }
    return res;
  }

  function _createRole(role: RoleElement) {
    const hasPrivileges = role.entry.privileges != null && role.entry.privileges.length > 0;
    const Arrow = hasPrivileges
      ? <ArrowDown
        className={appendClassName(styles.icon_expand, (role.expanded ? styles.expanded : null))} />
      : <></>;

    const menuVisible = props.onMenuClick != null;
    const Menu = menuVisible
      ? <MenuVertical onClick={(e) => props.onMenuClick!(role.entry, e)} className={styles.icon_dots} />
      : <div></div>;


    return (
      <div key={uid()} className={styles.role}>
        <div className={styles.role_entry} onClick={_expand(role)}>
          <div className={styles.role_left}>
            <div className={styles.role_heading}>
              <div className={styles.role_name}>
                {role.entry.name}
              </div>
              <div className={styles.role_type}>
                {role.entry.type}
              </div>
            </div>
            <div className={styles.role_description}>
              {role.entry.description}
            </div>
          </div>
          <div className={styles.role_right}>
            {Menu}
            {Arrow}
          </div>
        </div>
        {
          (role.expanded && hasPrivileges) ?
            <div className={styles.privileges}>
              {_createPrivilegeList(role.entry.privileges ?? [])}
            </div>
            : <></>
        }
      </div>
    )
  }

  function _createRoleList(roles: RoleElement[]) {
    const res = []
    for (const role of roles) {
      res.push(_createRole(role));
    }
    return res;
  }

  return (
    <div className={styles.roles}>
      {_createRoleList(props.roles)}
    </div>
  )
}

function createRoleElementList(roles: RoleModel[]) {
  return roles.map(r => new RoleElement(r, false));
}

function roleElementListGetElements(roleList: RoleElement[]) {
  return roleList.map(r => r.entry);
}

export default RoleList;
export { RoleElement, createRoleElementList, roleElementListGetElements }

