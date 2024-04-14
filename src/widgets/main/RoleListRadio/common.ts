import {RoleModel} from "@entities/role";
import {RoleRadioElement} from "@widgets/main/RoleListRadio/index";

function createRoleRadioElementList(roles: RoleModel[]) {
  return roles.map(r => new RoleRadioElement(r, false));
}

function getSelectedRoleId(roles: RoleRadioElement[]) {
  const selectedRole = roles.find(role => role.selected);
  return selectedRole ? selectedRole.entry.id : null;
}

export { createRoleRadioElementList, getSelectedRoleId }
