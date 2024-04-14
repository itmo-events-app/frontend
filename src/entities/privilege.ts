import { PrivilegeResponse } from '@shared/api/generated';

class PrivilegeModel {
  private _id: number;
  private _name: string;
  private _description?: string;

  constructor(id: number, name: string, description?: string) {
    this._id = id;
    this._name = name;
    this._description = description;
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  get description() {
    return this._description;
  }
}

function toPrivilegeModel(priv: PrivilegeResponse) {
  return new PrivilegeModel(priv.id!, priv.name!, priv.description);
}

function copyPrivilege(item: PrivilegeModel) {
  return new PrivilegeModel(item.id, item.name, item.description);
}

export { toPrivilegeModel, copyPrivilege };
export { PrivilegeModel };
