import { GetAllPrivilegesTypeEnum, RoleRequest, RoleResponse } from "@shared/api/generated";
import { PrivilegeModel, toPrivilegeModel } from "@entities/privilege";

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
  private _isEditable: boolean;

  constructor(id: number, name: string, type: RoleModelType, privileges?: PrivilegeModel[], description?: string, isEditable: boolean = true) {
    this._id = id;
    this._name = name;
    this._type = type;
    this._privileges = privileges;
    this._description = description;
    this._isEditable = isEditable;
  }

  get id() { return this._id }
  get name() { return this._name; }
  get description() { return this._description; }
  get privileges() { return this._privileges; }
  get type() { return this._type; }
  get isEditable() { return this._isEditable; }
}


function toRoleModel(role: RoleResponse): RoleModel {
  const type = RoleModelType[role.type!];

  let privileges = undefined;
  if (role.privileges) {
    privileges = role.privileges.map(p => toPrivilegeModel(p));
  }

  return new RoleModel(role.id!, role.name!, type, privileges, role.description, role.isEditable);
}

function fromRoleModel(role: RoleModel): RoleRequest {
  let privileges = undefined;
  if (role.privileges) {
    privileges = role.privileges.map(p => p.id);
  }


  return {
    name: role.name,
    description: role.description ?? '',
    isEvent: role.type == RoleModelType.EVENT,
    privileges: privileges ?? [],
  }
}

function copyRole(item: RoleModel) {
  return new RoleModel(
    item.id,
    item.name,
    item.type,
    [...(item.privileges ?? [])],
    item.description,
  )
}

function fromRoleModelType(type: RoleModelType) {
  const modelType = Object.keys(RoleModelType)[Object.values(RoleModelType).indexOf(type)];
  // return Object.keys(GetAllPrivilegesTypeEnum)
  //   .find(key => GetAllPrivilegesTypeEnum[(key as keyof typeof GetAllPrivilegesTypeEnum)] === modelType);
  return modelType as GetAllPrivilegesTypeEnum;
}


export { toRoleModel, fromRoleModel, copyRole, fromRoleModelType }
export { RoleModel, RoleModelType }
