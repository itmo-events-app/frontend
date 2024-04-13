import { uid } from 'uid'
import styles from './index.module.css'
import { RoleModel } from '@entities/role'
import { ArrowDown, MenuVertical } from '@shared/ui/icons'
import { appendClassName } from '@shared/util'
import { PrivilegeModel } from '@entities/privilege'

class RoleRadioElement {
  entry: RoleModel;
  expanded: boolean;
  selected: boolean

  constructor(entry: RoleModel, expanded: boolean = false, selected: boolean = false) {
    this.entry = entry;
    this.expanded = expanded;
    this.selected = selected;
  }
}

type Props = {
  roles: RoleRadioElement[],
  setRoles: React.Dispatch<React.SetStateAction<RoleRadioElement[]>>
}

function RoleListRadio(props: Props) {
  function _select(tab: RoleRadioElement) {
    return () => {
      const updateSelection = props.roles.map(role => ({
        ...role,
        selected: role === tab ? !role.selected : false
      }));
      props.setRoles(updateSelection);
    }
  }

  function _expand(tab: RoleRadioElement) {
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

  function _createRole(role: RoleRadioElement) {
    const hasPrivileges = role.entry.privileges != null && role.entry.privileges.length > 0;
    const Arrow = hasPrivileges
      ? <ArrowDown
        className={appendClassName(styles.icon_expand, (role.expanded ? styles.expanded : null))} />
      : <></>;

    return (
      <div key={uid()} className={appendClassName(role.selected ? styles.selected_role : styles.role)}>
        <div className={styles.role_entry}>
          <div className={styles.role_left} onClick={_select(role)}>
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
          <div className={styles.role_right} onClick={_expand(role)}>
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

  function _createRoleList(roles: RoleRadioElement[]) {
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

function createRoleRadioElementList(roles: RoleModel[]) {
  return roles.map(r => new RoleRadioElement(r, false));
}

function getSelectedRoleId(roles: RoleRadioElement[]) {
  const selectedRole = roles.find(role => role.selected);
  return selectedRole ? selectedRole.entry.id : null;
}

export default RoleListRadio;
export { RoleRadioElement, createRoleRadioElementList, getSelectedRoleId }

