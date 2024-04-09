import { intersection, union } from '@shared/util'
import { PrivilegeData } from './PrivilegeProvider';

function getPrivilegeDataNames(set: Set<PrivilegeData>) {
  return new Set([...set].map(e => e.name));
}

function hasAnyPrivilege(mine: Set<PrivilegeData> | undefined, others: Set<PrivilegeData>) {
  const mineNames = getPrivilegeDataNames(mine ?? new Set<PrivilegeData>());
  const othersNames = getPrivilegeDataNames(others);
  return intersection(mineNames, othersNames).size > 0;
}

function hasAllPrivileges(mine: Set<PrivilegeData> | undefined, others: Set<PrivilegeData>) {
  const mineNames = getPrivilegeDataNames(mine ?? new Set<PrivilegeData>());
  const othersNames = getPrivilegeDataNames(others);
  return union(mineNames, othersNames).size == othersNames.size;
}


function anyPrivilege(others: Set<PrivilegeData>) {
  return function(mine: Set<PrivilegeData>) {
    return hasAnyPrivilege(mine, others);
  }
}

function allPrivileges(others: Set<PrivilegeData>) {
  return function(mine: Set<PrivilegeData>) {
    return hasAllPrivileges(mine, others);
  }
}

export { hasAnyPrivilege, hasAllPrivileges, anyPrivilege, allPrivileges }
