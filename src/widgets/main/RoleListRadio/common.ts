import { RoleModel } from "@entities/role";

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

function createRoleRadioElementList(roles: RoleModel[]) {
  return roles.map(r => new RoleRadioElement(r, false));
}

function getSelectedRoleId(roles: RoleRadioElement[]) {
  const selectedRole = roles.find(role => role.selected);
  return selectedRole ? selectedRole.entry.id : null;
}

export { RoleRadioElement, createRoleRadioElementList, getSelectedRoleId }
