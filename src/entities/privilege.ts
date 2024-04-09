import { PrivilegeResponse, PrivilegeResponseNameEnum } from "@shared/api/generated";

class PrivilegeModel {
  private _id: number;
  private _name: string;
  private _description?: string;

  constructor(id: number, name: string, description?: string) {
    this._id = id;
    this._name = name;
    this._description = description;
  }

  get id() { return this._id };
  get name() { return this._name; }
  get description() { return this._description; }
}

function toPrivilegeModel(priv: PrivilegeResponse) {
  return new PrivilegeModel(priv.id!, priv.name!, priv.description);
}

function fromPrivilegeModel(priv: PrivilegeModel): PrivilegeResponse {
  return {
    id: priv.id,
    name: priv.name as PrivilegeResponseNameEnum,
    description: priv.description
  }
}

export { toPrivilegeModel, fromPrivilegeModel }
export { PrivilegeModel }
