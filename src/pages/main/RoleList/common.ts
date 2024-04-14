import { PrivilegeModel } from '@entities/privilege';
import { RoleModelType } from '@entities/role';

const dropdownOptions = Object.values(RoleModelType);

function dropdownOptionToText(e: RoleModelType): string {
  return e;
}

function privilegeToText(item: PrivilegeModel) {
  return item.name + ' - ' + item.description;
}
export { dropdownOptions, dropdownOptionToText, privilegeToText };
