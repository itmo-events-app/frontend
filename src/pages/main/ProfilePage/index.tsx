import Layout from '@widgets/main/Layout';
import BrandLogo from '@widgets/main/BrandLogo';
import PageName from '@widgets/main/PageName';
import SideBar from '@widgets/main/SideBar';
import { RoutePaths } from '@shared/config/routes';
import Content from '@widgets/main/Content';
import styles from './index.module.css';
import Button from '@widgets/auth/Button';
import { appendClassName } from '@shared/util';
import { useContext, useState } from 'react';
import ApiContext from '@features/api-context';
import { useQuery } from '@tanstack/react-query';
import {
  NotificationSettingsRequest,
  ProfileResponse,
  UserChangeLoginRequest,
  UserChangeNameRequest,
} from '@shared/api/generated/index';
import profileService from '@features/profile-service';
import Label from '@widgets/auth/InputLabel';
import Input from '@widgets/main/Input';
import { useNavigate } from 'react-router-dom';
import { uid } from 'uid';
import { Check, Pencil } from '@shared/ui/icons';
import ModalBlock from '@widgets/main/Modal';

const EMAIL_CONFIRM_RETURN_URL = window.location.protocol + '//' + window.location.host + RoutePaths.confirmEmail;
const MAIL_RECONFIRM_MSG = 'Письмо со ссылкой для подтверждения почты отправлено.';
const MAIL_RECONFIRM_FAIL_MSG = 'Не удалось отправить письмо со ссылкой для подтверждения почты.';

const NAME_MAX_LENGTH = 64;
const SURNAME_MAX_LENGTH = 64;
const EMAIL_MAX_LENGTH = 128;

const MAIL_REGEX = '^\\w[\\w\\-.]*@(niu|idu.)?itmo\\.ru$';

const EMPTY_ERR_MSG = 'Поля не должны быть пустыми';
const NON_CYRILLIC_SYM_NAME_ERR_MSG = 'Имя должно содержать только буквы кириллицы без цифр и специальных символов';
const NON_CYRILLIC_SYM_SURNAME_ERR_MSG =
  'Фамилия должна содержать только буквы кириллицы без цифр и специальных символов';
const MAIL_DOMAIN_ERR_MSG = 'Некорректный Email. Поддерживаемые домены: @itmo.ru, @idu.itmo.ru и @niuitmo.ru';

function ProfilePage() {
  const navigate = useNavigate();
  const { api } = useContext(ApiContext);
  const { data: userInfo, refetch: refetchUserInfo } = useQuery<ProfileResponse>({
    queryFn: () => profileService.getUserInfo(api),
    enabled: true,
    queryKey: ['userInfo'],
  });

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [isEditing, setIsEditingMode] = useState(false);

  const [isChangingLogin, setIsChangingLogin] = useState(false);
  const [login, setLogin] = useState('');

  const [errorMessageEditingName, setErrorMessageEditingName] = useState('');
  const [errorMessageEditingLogin, setErrorMessageEditingLogin] = useState('');

  const [modalBlockActive, setModalBlockActive] = useState(false);
  const [modalBlockText, setModalBlockText] = useState('');

  const customEditRenameModal = () => {
    setIsEditingMode((prev) => !prev);
  };

  const customEditChangeLoginModal = () => {
    setIsChangingLogin((prev) => !prev);
  };

  const clearFieldsForEditingName = () => {
    setIsEditingMode(false);
    setName('');
    setSurname('');
  };

  const clearFieldsForChangingLogin = () => {
    setIsChangingLogin(false);
    setLogin('');
  };

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('ru-RU');
  }

  const handleLoginChange = async () => {
    if (login.trim().length == 0) {
      setErrorMessageEditingLogin(EMPTY_ERR_MSG);
      return;
    } else if (!new RegExp(MAIL_REGEX).test(login)) {
      setErrorMessageEditingLogin(MAIL_DOMAIN_ERR_MSG);
      return;
    }

    try {
      const userChangeLoginRequest: UserChangeLoginRequest = { login, type: 'EMAIL' };
      await profileService.changeLogin(api, userChangeLoginRequest);
      clearFieldsForChangingLogin();
      setErrorMessageEditingLogin('');
      refetchUserInfo();
    } catch (error: any) {
      if (error.response.data.errors) {
        const errorMessage = error.response.data.errors.join(', ');
        setErrorMessageEditingLogin(errorMessage);
      } else {
        const errorMessage = error.response.data;
        setErrorMessageEditingLogin(errorMessage);
      }
    }
  };

  const handleNameChange = async () => {
    const nameRegex = /^[а-яё\s-]*$/i; 

    if (name.trim().length == 0 || surname.trim().length == 0) {
      setErrorMessageEditingName(EMPTY_ERR_MSG);
      return;
    } else if (!nameRegex.test(name)) {
      setErrorMessageEditingName(NON_CYRILLIC_SYM_NAME_ERR_MSG);
      return;
    } else if (!nameRegex.test(surname)) {
      setErrorMessageEditingName(NON_CYRILLIC_SYM_SURNAME_ERR_MSG);
      return;
    }

    try {
      const userChangeNameRequest: UserChangeNameRequest = { name, surname };
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
      enablePush: userInfo?.enablePushNotifications ? userInfo.enablePushNotifications : false,
    };
    console.log(newSettings);
    await profileService.updateNotifications(api, newSettings);
    setIsEditingMode(false);
    refetchUserInfo();
  };

  const _resend = () => {
    api.auth
      .sendVerificationEmail(EMAIL_CONFIRM_RETURN_URL)
      .then(() => {
        console.log('Email confirmation message sent!');
        _openModalBlock(MAIL_RECONFIRM_MSG);
      })
      .catch((e) => {
        console.log(MAIL_RECONFIRM_FAIL_MSG);
        console.log(e.response.data);
        _openModalBlock(e.response.data);
      });
  };

  const _setName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > NAME_MAX_LENGTH) {
      return;
    }
    setName(value);
    setErrorMessageEditingName('');
  };

  const _setSurname = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > SURNAME_MAX_LENGTH) {
      return;
    }
    setSurname(value);
    setErrorMessageEditingName('');
  };

  function _renderProfileEdit() {
    return (
      <div className={appendClassName(styles.form, isEditing ? styles.visible : styles.hidden)}>
        {errorMessageEditingName && <div className={styles.form_error}>{errorMessageEditingName}</div>}
        <div>
          <Label value="Имя " error={false} />
          <Input type="text" placeholder="Введите имя" value={name} onChange={_setName} />
        </div>
        <div>
          <Label value="Фамилия " error={false} />
          <Input type="text" placeholder="Введите фамилию" value={surname} onChange={_setSurname} />
        </div>
        <div>
          <Button className={styles.form_btn} onClick={handleNameChange}>
            Сохранить
          </Button>
          <Button className={styles.form_btn} onClick={clearFieldsForEditingName}>
            Закрыть
          </Button>
        </div>
      </div>
    );
  }

  const _setLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > EMAIL_MAX_LENGTH) {
      return;
    }
    setLogin(value);
    setErrorMessageEditingLogin('');
  };

  function _renderLoginEdit() {
    return (
      <div className={appendClassName(styles.form, isChangingLogin ? styles.visible : styles.hidden)}>
        {errorMessageEditingLogin && <div className={styles.form_error}>{errorMessageEditingLogin}</div>}
        <div>
          <Label value="Новый логин " error={false} />
          <Input type="text" placeholder="Введите новый логин" value={login} onChange={_setLogin} />
        </div>
        <div>
          <Button className={styles.form_btn} onClick={handleLoginChange}>
            Сохранить
          </Button>
          <Button className={styles.form_btn} onClick={clearFieldsForChangingLogin}>
            Закрыть
          </Button>
        </div>
      </div>
    );
  }

  const _getInitials = () => {
    const nameInitial = userInfo?.name?.[0] || '';
    const surnameInitial = userInfo?.surname?.[0] || '';

    return nameInitial + surnameInitial;
  };

  const _getEmptyStringIfUndef = (str: string | undefined): string => (str ? str : '');

  const _openModalBlock = (text: string) => {
    setModalBlockText(text);
    setModalBlockActive(true);
  };

  const _closeModalBlock = () => {
    setModalBlockActive(false);
  };

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={<PageName text="Профиль" />}
      bottomLeft={<SideBar currentPageURL={RoutePaths.profile} />}
      bottomRight={
        <Content>
          <ModalBlock active={modalBlockActive} closeModal={_closeModalBlock}>
            <div className={appendClassName(styles.modal_container, styles.block)}>
              <span className={styles.header}>{'Подтверждение почты'}</span>
              <div className={appendClassName(styles.row, styles.success_message)}>
                <span>{modalBlockText}</span>
                <Check className={styles.success_check} />
              </div>
              <Button onClick={_closeModalBlock}>Закрыть</Button>
            </div>
          </ModalBlock>

          <div className={styles.root}>
            <div className={appendClassName(styles.grid_column, styles.grid_column_profile)}>
              <div className={styles.profile}>
                <div className={styles.profile_initials}>{_getInitials()}</div>

                <div className={styles.row}>
                  <div className={styles.profile_name}>
                    {_getEmptyStringIfUndef(userInfo?.name) + ' ' + _getEmptyStringIfUndef(userInfo?.surname)}
                  </div>
                  <Pencil className={styles.icon} onClick={customEditRenameModal} />
                </div>
                {_renderProfileEdit()}

                <div className={styles.row}>
                  <div className={styles.profile_login}>{userInfo?.userInfo && userInfo?.userInfo[0].login}</div>
                  <Pencil className={styles.icon} onClick={customEditChangeLoginModal} />
                </div>
                {_renderLoginEdit()}

                <div className={styles.profile_online}>
                  Последний вход: {userInfo?.lastLoginDate ? formatDate(userInfo.lastLoginDate) : 'Нет данных'}
                </div>
              </div>
              <div className={styles.controls}>
                <Button className={styles.btn} onClick={_resend}>
                  Подтверждение почты
                </Button>
                <Button className={styles.btn} onClick={() => navigate(RoutePaths.changePassword)}>
                  Сменить пароль
                </Button>
                <Button
                  className={appendClassName(styles.red_btn, styles.btn)}
                  onClick={() => navigate(RoutePaths.login)}
                >
                  Выйти
                </Button>
              </div>
            </div>
            <div className={appendClassName(styles.grid_column, styles.grid_column_settings)}>
              <div className={appendClassName(styles.settings)}>
                <div className={styles.settings_title}>Уведомления</div>
                <div className={styles.settings_content}>
                  <_ToggleSwitch
                    label={'Получать уведомления по почте'}
                    value={userInfo?.enableEmailNotifications}
                    onChange={() => handleEmailNotificationChange(!userInfo?.enableEmailNotifications)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Content>
      }
    />
  );
}

type _ToggleSwitchProps = {
  label: string | undefined;
  value: boolean | undefined;
  onChange: any;
};

function _ToggleSwitch(props: _ToggleSwitchProps) {
  const id = uid();

  return (
    <div className={styles.field}>
      <span>{props.label}</span>
      <div className={styles.toggle_container}>
        <input
          type={'checkbox'}
          onChange={() => {
            props.onChange();
          }}
          checked={props.value ? props.value : false}
          id={id}
          className={styles.toggle}
        />
        <label htmlFor={id} className={styles.toggle_label} />
      </div>
    </div>
  );
}

export default ProfilePage;
