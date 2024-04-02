import { difference, intersection} from '@shared/util'

function hasAnyPrivilege(mine: Set<PrivilegeNames>, others: Set<PrivilegeName>) {
  return intersection(mine, others).size > 0;
}

function hasAllPrivileges(mine: Set<PrivilegeNames>, others: Set<PrivilegeNames>) {
  return union(mine, others).size == others.size;
}

