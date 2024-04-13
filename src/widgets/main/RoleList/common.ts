import { RoleModel } from "@entities/role";
import { RoleElement } from ".";

function createRoleElementList(roles: RoleModel[]) {
  return roles.map(r => new RoleElement(r, false));
}

function roleElementListGetElements(roleList: RoleElement[]) {
  return roleList.map(r => r.entry);
}

export { createRoleElementList, roleElementListGetElements }
