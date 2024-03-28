import { uid } from 'uid'
import styles from './index.module.css'
import { PrivilegeModel, RoleModel } from '@entities/Role'
import { ArrowDown, MenuVertical } from '@shared/ui/icons'
import { useState } from 'react'
import { appendClassName } from '@shared/util'

type Props = {
  roles: RoleModel[],
  onMenuClick?: (role: RoleModel, e: React.MouseEvent) => void,
}

class Role {
  entry: RoleModel;
  expanded: boolean;

  constructor(entry: RoleModel, expanded: boolean = false) {
    this.entry = entry;
    this.expanded = expanded;
  }
}


function RoleList(props: Props) {
  const [roles, setRoles] = useState(props.roles.map(r => new Role(r)));

  function _expand(tab: Role) {
    return () => {
      tab.expanded = !tab.expanded;
      setRoles([...roles]);
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

  function _createRole(role: Role) {
    const hasPrivileges = role.entry.privileges.length > 0;
    const Arrow = hasPrivileges
      ? <ArrowDown
        className={appendClassName(styles.icon_expand, (role.expanded ? styles.expanded : null))} />
      : <></>;

    const onMenuClick = props.onMenuClick ?? ((_) => { });
    const Menu = <MenuVertical onClick={(e) => onMenuClick(role.entry, e)} className={styles.icon_dots} />;

    return (
      <div key={uid()} className={styles.role}>
        <div className={styles.role_entry} onClick={_expand(role)}>
          <div className={styles.role_left}>
            <div className={styles.role_name}>
              {role.entry.name}
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
              {_createPrivilegeList(role.entry.privileges)}
            </div>
            : <></>
        }
      </div>
    )
  }

  function _createRoleList(roles: Role[]) {
    const res = []
    for (const role of roles) {
      res.push(_createRole(role));
    }
    return res;
  }

  return (
    <div className={styles.roles}>
      {_createRoleList(roles)}
    </div>
  )
}

export default RoleList;

