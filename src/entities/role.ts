import { RoleResponse, RoleResponseTypeEnum } from "@shared/api/generated";
import { PrivilegeModel, fromPrivilegeModel, toPrivilegeModel } from "@entities/privilege";

enum RoleModelType {
  SYSTEM = "Системная",
  EVENT = "Организационная",
}

class RoleModel {
  private _id: number;
  private _name: string;
  private _type: RoleModelType;
  private _privileges?: PrivilegeModel[];
  private _description?: string;

  constructor(id: number, name: string, type: RoleModelType, privileges?: PrivilegeModel[], description?: string) {
    this._id = id;
    this._name = name;
    this._type = type;
    this._privileges = privileges;
    this._description = description;
  }

  get id() { return this._id };
  get name() { return this._name; }
  get description() { return this._description; }
  get privileges() { return this._privileges; }
  get type() { return this._type; }
}


function toRoleModel(role: RoleResponse): RoleModel {
  const type = RoleModelType[role.type!];

  let privileges = undefined;
  if (role.privileges) {
    privileges = role.privileges.map(p => toPrivilegeModel(p));
  }

  return new RoleModel(role.id!, role.name!, type, privileges, role.description);
}

function fromRoleModel(role: RoleModel): RoleResponse {
  let privileges = undefined;
  if (role.privileges) {
    privileges = role.privileges.map(p => fromPrivilegeModel(p));
  }

  const modelType = Object.keys(RoleModelType)[Object.values(RoleModelType).indexOf(role.type)];
  const responseType = Object.keys(RoleResponseTypeEnum)
    .find(key => RoleResponseTypeEnum[(key as keyof typeof RoleResponseTypeEnum)] === modelType);

  return {
    id: role.id,
    name: role.name,
    type: responseType as any,
    description: role.description,
    privileges: privileges,
  }
}

export { toRoleModel, fromRoleModel }
export { RoleModel, RoleModelType }
