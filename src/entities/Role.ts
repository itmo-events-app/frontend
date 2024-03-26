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

class RoleModel {
  private _id: number;
  private _name: string;
  private _description?: string;
  private _privileges: PrivilegeModel[];

  constructor(id: number, name: string, privileges: PrivilegeModel[] = [], description?: string) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._privileges = privileges;
  }

  get id() { return this._id };
  get name() { return this._name; }
  get description() { return this._description; }
  get privileges() { return this._privileges; }
}

export { PrivilegeModel, RoleModel }
