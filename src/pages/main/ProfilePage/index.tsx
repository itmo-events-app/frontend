import styles from './index.module.css';
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import Content from '@widgets/main/Content';
import SideBar from '@widgets/main/SideBar';
import Button from '@widgets/auth/Button';
import Label from '@widgets/auth/InputLabel';
import Input from '@widgets/main/Input';
import { RoutePaths } from '@shared/config/routes';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import ApiContext from '@features/api-context.ts';
import profileService from '@features/profile-service.ts';
import {
  ProfileResponse,
  NotificationSettingsRequest,
  UserChangeNameRequest,
  UserChangeLoginRequest,
} from "@shared/api/generated";
import { useState } from "react";


function ProfilePage() {
  const navigate = useNavigate();
  const {api} = useContext(ApiContext);
  const {data: userInfo, refetch: refetchUserInfo} = useQuery<ProfileResponse>({
    queryFn: () => profileService.getUserInfo(api),
    enabled: true,
    queryKey: ['userInfo'],
  });

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsRequest | null>(null);
  const [isEditing, setIsEditingMode] = useState(false);

  const [isChangingLogin, setIsChangingLogin] = useState(false);
  const [login, setLogin] = useState('');

  const [errorMessageEditingName, setErrorMessageEditingName] = useState('');
  const [errorMessageEditingLogin, setErrorMessageEditingLogin] = useState('');

  const customEditRenameModal = () => {
    setIsEditingMode((prev) => !prev);
  };

  const customEditChangeLoginModal = () => {
    setIsChangingLogin((prev) => !prev);
  };

  const clearFieldsForEditingName = () => {
    setName('');
    setSurname('');
    setIsEditingMode(false);
  };

  const clearFieldsForChangingLogin = () => {
    setLogin('');
    setIsChangingLogin(false);
  };

  const handleLoginChange = async () => {
    try {
      const userChangeLoginRequest: UserChangeLoginRequest = {login, type:"EMAIL"};
      await profileService.changeLogin(api, userChangeLoginRequest);
      clearFieldsForChangingLogin();
      setErrorMessageEditingLogin('');
      refetchUserInfo();
    } catch (error: any) {
      if (error.response.data.errors) {
        const errorMessage = error.response.data.errors.join(', ');
        setErrorMessageEditingLogin(errorMessage);
      }
      else {
        const errorMessage = error.response.data;
        setErrorMessageEditingLogin(errorMessage);
      }
    }
  };

  const handleNameChange = async () => {
    try {
      const userChangeNameRequest: UserChangeNameRequest = {name, surname};
      await profileService.changeName(api, userChangeNameRequest);
      clearFieldsForEditingName();
      setErrorMessageEditingName('');
      refetchUserInfo();
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessage = error.response.data.errors.join(', ');
        setErrorMessageEditingName(errorMessage);
      }
    }
  };

  const handleEmailNotificationChange = async (enableEmail: boolean) => {
    const newSettings: NotificationSettingsRequest = {
      enableEmail,
      enablePush: notificationSettings ? notificationSettings.enablePush : false
    };
    await profileService.updateNotifications(api, newSettings);
    setNotificationSettings(newSettings);
    setIsEditingMode(false);
    refetchUserInfo();
  };

  const handlePushNotificationChange = async (enablePush: boolean) => {
    const newSettings: NotificationSettingsRequest = {
      enableEmail: notificationSettings ? notificationSettings.enableEmail : false,
      enablePush
    };
    await profileService.updateNotifications(api, newSettings);
    setNotificationSettings(newSettings);
    setIsEditingMode(false);
    refetchUserInfo();
  };

  function _renderProfileEdit() {
    return (
      <>
        <div>
          <Label value="Имя " error={false}/>
          <Input
            type="text"
            placeholder="Введите имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label value="Фамилия " error={false}/>
          <Input
            type="text"
            placeholder="Введите фамилию"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </div>
        {errorMessageEditingName && <div className={styles.error}>{errorMessageEditingName}</div>}
        <div className={styles.button_row}>
          <Button onClick={handleNameChange}>Сохранить изменения</Button>
          <Button onClick={clearFieldsForEditingName}>Закрыть</Button>
        </div>
      </>
    );
  }

  function _renderLoginEdit() {
    return (
      <>
        <div>
          <Label value="Новый логин " error={false}/>
          <Input
            type="text"
            placeholder="Введите новый логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>
        {errorMessageEditingLogin && <div className={styles.error}>{errorMessageEditingLogin}</div>}
        <div className={styles.button_row}>
          <Button onClick={handleLoginChange}>Сохранить изменения</Button>
          <Button onClick={clearFieldsForChangingLogin}>Закрыть</Button>
        </div>
      </>
    );
  }

  return (
    <Layout
      topLeft={<BrandLogo/>}
      topRight={<PageName text="Профиль"/>}
      bottomLeft={<SideBar currentPageURL={RoutePaths.profile}/>}
      bottomRight=
        {
          <Content>
            <div className={styles.root}>
              <div className={styles.profile}>
                <div className={styles.profile_col}>
                  <table className={styles.table}>
                    <tbody>
                    <tr>
                      <td>Имя</td>
                      <td>{userInfo?.name}</td>
                    </tr>
                    <tr>
                      <td>Фамилия</td>
                      <td>{userInfo?.surname}</td>
                    </tr>
                    <tr>
                      <td>Время последнего входа в систему</td>
                      <td>{userInfo?.lastLoginDate}</td>
                    </tr>
                    <tr>
                      <td>Уведомления почта</td>
                      <td>{userInfo?.enableEmailNotifications === true ? 'Включены' : 'Выключены'}</td>
                    </tr>
                    <tr>
                      <td>Уведомления пуш</td>
                      <td>{userInfo?.enablePushNotifications === true ? 'Включены' : 'Выключены'}</td>
                    </tr>
                    <tr>
                      <td>Устройства</td>
                      {userInfo?.devices ? (
                        <td>{userInfo.devices.join(', ')}</td>
                      ) : (
                        <td>Нет устройств</td>
                      )}
                    </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles.profile_col}>
                  <Button className={styles.button} onClick={() => handleEmailNotificationChange(!notificationSettings?.enableEmail)}>
                    {notificationSettings?.enableEmail ? 'Отключить уведомления по почте' : 'Включить уведомления по почте'}
                  </Button>
                  <Button className={styles.button} onClick={() => handlePushNotificationChange(!notificationSettings?.enablePush)}>
                    {notificationSettings?.enablePush ? 'Отключить пуш-уведомления' : 'Включить пуш-уведомления'}
                  </Button>
                  {isEditing ? (
                    _renderProfileEdit()
                  ) : (
                    <Button className={styles.button} onClick={customEditRenameModal}>Редактировать имя и фамилию</Button>
                  )}
                  {isChangingLogin ? (
                    _renderLoginEdit()
                  ) : (
                    <Button className={styles.button} onClick={customEditChangeLoginModal}>Сменить логин</Button>
                  )}
                  <Button className={styles.button} onClick={() => navigate(RoutePaths.changePassword)}>Сменить пароль</Button>
                </div>
              </div>
              <Button className={styles.exit_button} onClick={() => navigate(RoutePaths.login)}>Выйти</Button>
            </div>
          </Content>
        }
    />
  );
}

export default ProfilePage;
