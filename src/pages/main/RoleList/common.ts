import { PrivilegeModel } from "@entities/privilege";
import { RoleModelType } from "@entities/role";
import { DropdownOption } from "@widgets/main/Dropdown";

const dropdownOptions = Object.values(RoleModelType).map(e => new DropdownOption(e));

function displayPrivilege(item: PrivilegeModel) {
  return item.name + " - " + item.description;
}

export {dropdownOptions, displayPrivilege}
