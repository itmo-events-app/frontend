import Button from "@widgets/main/Button";
import InputLabel from "@widgets/main/InputLabel";
import styles from './index.module.css';
import { useContext, useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import ApiContext from '@features/api-context.ts';
import { RoleResponse, UserResponse } from '@shared/api/generated';
import Dropdown, { DropdownOption } from "@widgets/main/Dropdown";

const DeleteOrganizerDialog = ({ eventId, onDelete}: { eventId: number; onDelete: () => void }) => {
  const [userList, setUserList] = useState([] as UserResponse[]);
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [roleList, setRoleList] = useState([] as RoleResponse[]);
  const [roleId, setRoleId] = useState<number | undefined>(undefined);
  const [roleName, setRoleName] = useState<string | undefined>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { api } = useContext(ApiContext);

  const initDialog = async () => {
    const getUsersResponse = await api.profile.getAllUsers();
    // const getAllRoles = await api.role.getAllRoles();
    const getAllRoles = await api.role.getOrganizationalRoles();
    if (getUsersResponse.status == 200 && getAllRoles.status == 200) {
      const items = getUsersResponse.data.items;
      setUserList(items ?? []);
      if (items != null && items.length > 0) {
        setUserId(items[0].id)
      } else {
        setUserId(undefined);
      }
      const eventRoles = getAllRoles.data.filter(r => r.type == "EVENT");
      setRoleList(eventRoles);
      setRoleId(eventRoles[0].id);
      setRoleName(eventRoles[0].name);
    } else {
      console.log(getUsersResponse.status);
    }
  };
  const getCurrentUserId = async () => {
    const userInfoResponse = await api.profile.getUserInfo();
    if (userInfoResponse.status == 200) {
      const userInfo = userInfoResponse.data;
      return userInfo.userId;
    } else {
      console.log(userInfoResponse.status);
      return null;
    }
  };
  useEffect(() => {
    initDialog();
    getCurrentUserId();
  }, []);

  const handleDeleteOrganizer = async () => {
    console.log(roleName);
    console.log(userId);
    const currentUserId = await getCurrentUserId();
    if (userId === currentUserId  && roleName === 'Организатор') {
      setErrorMessage('Вы не можете отозвать свою собственную роль организатора!');
      return;
    }
    if (roleName == 'Организатор') {
      const result = await api.role.revokeOrganizerRole(userId!, eventId);
      if (result.status != 204) {
        console.log(result.status);
      } else {
        onDelete();
      }
    } else if (roleName == 'Помощник') {
      const result = await api.role.revokeAssistantRole(userId!, eventId);
      if (result.status != 204) {
        console.log(result.status);
      } else {
        onDelete();
      }
    } else {
      const result = await api.role.revokeOrganizationalRole(userId!, eventId, roleId!);
      if (result.status != 204) {
        console.log(result.status);
      } else {
        onDelete();
      }
    }
  };
  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_item}>
        <InputLabel value="Пользователь" />
        <Dropdown placeholder="Пользователь" value={new DropdownOption(userId?.toString())} onChange={(e) => setUserId(parseInt(e as any))}
          items={userList.map((u) =>
            new DropdownOption(u.name, u.id?.toString())
          )} />
        <InputLabel value="Роль" />
        <Dropdown placeholder="Роль" value={new DropdownOption(roleId?.toString())} onChange={(e) => {
          setRoleId(parseInt(e as any))
          const foundRole = roleList.find((r) => r.id == parseInt(e as any));
          if (foundRole != undefined) {
            setRoleName(foundRole.name);
          }
        }}
          items={roleList.map((r) =>
            new DropdownOption(r.name, r.id?.toString())
          )} />
      </div>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <Button onClick={handleDeleteOrganizer}>Удалить</Button>
    </div>
  );
};

export default DeleteOrganizerDialog;