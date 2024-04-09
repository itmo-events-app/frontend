import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import Content from '@widgets/main/Content';
import SideBar from '@widgets/main/SideBar';
import Search from '@widgets/main/Search';
import Button from '@widgets/main/Button';
import RoleList from '@widgets/main/RoleList';
import { PrivilegeModel, RoleModel } from '@entities/Role';
import ContextMenu, { ContextMenuItem } from '@widgets/main/ContextMenu';
import { useContext, useEffect, useRef, useState } from 'react';
import Dialog from '@widgets/main/Dialog';
import { appendClassName } from '@shared/util';

import styles from './index.module.css'
import Fade from '@widgets/main/Fade';
import Input from '@widgets/main/Input';
import InputLabel from '@widgets/main/InputLabel';
import InputCheckboxList from '@widgets/main/InputCheckboxList';
import { RoutePaths } from '@shared/config/routes';
import { PrivilegeContext, PrivilegeData } from '@features/PrivilegeProvider';
import { hasAnyPrivilege } from '@features/privileges';
import { PrivilegeNames } from '@shared/config/privileges';
import Dropdown, { DropdownOption } from '@widgets/main/Dropdown';
import TextArea from '@widgets/main/TextArea';

// const _PlainIcon = () => <div style={{ height: '24px', width: '24px' }}></div>;
const _privileges = []
const _roles = []


class ContextMenuData {
  clientX: number;
  clientY: number;
  visible: boolean;
  items: ContextMenuItem[];
  constructor(
    clientX: number = 0,
    clientY: number = 0,
    visible: boolean = false,
    items: ContextMenuItem[] = []
  ) {
    this.clientX = clientX;
    this.clientY = clientY;
    this.visible = visible;
    this.items = items;
  }
}

class DialogData {
  heading: string | undefined;
  content: any;
  visible: boolean;
  constructor(
    heading?: string,
    content?: any,
    visible: boolean = false,
  ) {
    this.heading = heading;
    this.content = content;
    this.visible = visible;
  }
}

function _displayPrivilege(item: PrivilegeModel) {
  return item.name + " - " + item.description;
}

const _CreateRoleDialogContent = (props: { onDone: any }) => {
  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_form}>
        <div className={styles.dialog_item}>
          <InputLabel value="Название роли" />
          <Input value="РОЛЬ" />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Описание" />
          <TextArea />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Тип роли" />
          <Dropdown items={[new DropdownOption('Организационная'), new DropdownOption('Системная')]} value={'Системная'} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Список привилегий" />
          <InputCheckboxList items={_privileges} displayName={_displayPrivilege} />
        </div>
      </div>
      <Button onClick={props.onDone}>Создать</Button>
    </div>
  );
}

const _UpdateRoleDialogContent = (props: { role: RoleModel, onDone: any }) => {
  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_form}>
        <div className={styles.dialog_item}>
          <InputLabel value="Название роли" />
          <Input value={props.role.name} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Описание" />
          <TextArea value={props.role.description} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Тип" />
          <Dropdown items={[new DropdownOption('Организационная'), new DropdownOption('Системная')]} value={'Системная'} />
        </div>
        <div className={styles.dialog_item}>
          <InputLabel value="Список привилегий" />
          <InputCheckboxList items={_privileges} displayName={_displayPrivilege} />
        </div>
      </div>
      <Button onClick={props.onDone}>Изменить</Button>
    </div>
  );
}

const privilegeOthers = {
  create: new Set([
    new PrivilegeData(PrivilegeNames.CREATE_ROLE)
  ]),
  edit: new Set([
    new PrivilegeData(PrivilegeNames.EDIT_ROLE)
  ]),
  delete: new Set([
    new PrivilegeData(PrivilegeNames.DELETE_ROLE)
  ])
}

function RoleListPage() {
  const { privilegeContext } = useContext(PrivilegeContext);

  const [cmData, setCmData] = useState(new ContextMenuData());
  const [dialogData, setDialogData] = useState(new DialogData());

  const cmRef = useRef(null);
  const dialogRef = useRef(null);

  const menuVisible = hasAnyPrivilege(privilegeContext.systemPrivileges, new Set([
    ...privilegeOthers.edit,
    ...privilegeOthers.delete
  ]))

  // set context menu position. not using transform(-100%, 0%) to handle content bounds
  // NOTE: can move to controller object
  // TODO: handle when context menu out of content bounds
  useEffect(() => {
    if (cmRef.current) {
      const current = cmRef.current as any;
      current.style.left = `${cmData.clientX - (cmRef.current as any).offsetWidth}px`;
      current.style.top = `${cmData.clientY}px`;
    }
  })

  // close context menu when clicking outside
  useEffect(() => {
    const handler = (e: any) => {
      if (cmRef.current) {
        if (cmData.visible && !(cmRef.current as any).contains(e.target)) {
          _closeContextMenu();
        }
      }
    }
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    }
  }, [cmData, cmRef]);

  // close dialog when clicking outside
  useEffect(() => {
    const handler = (e: any) => {
      if (dialogRef.current) {
        if (dialogData.visible && !(dialogRef.current as any).contains(e.target)) {
          _closeDialog();
        }
      }
    }
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    }
  }, [dialogData, dialogRef]);


  const _closeDialog = () => {
    setDialogData(new DialogData());
  }

  const _closeContextMenu = () => {
    setCmData(new ContextMenuData());
  }

  const _onSearch = (v: string) => {
    console.log(v);
  }

  const _createRole = (e: MouseEvent) => {
    setDialogData(new DialogData('Создание роли', _CreateRoleDialogContent({ onDone: _closeDialog }), true));
    e.stopPropagation();
  }

  const _onMenuClick = (role: RoleModel, e: React.MouseEvent) => {
    const contextItems: ContextMenuItem[] = [
      new ContextMenuItem('Редактировать', (e: React.MouseEvent) => {
        setCmData({ ...cmData, visible: false });
        setDialogData(new DialogData('Редактирование роли', _UpdateRoleDialogContent({ role: role, onDone: _closeDialog }), true));
        e.stopPropagation();
      }),
      new ContextMenuItem('Удалить', () => {
        setCmData({ ...cmData, visible: false });
      }),
    ]

    const mine = privilegeContext.systemPrivileges;

    const filteredItems = contextItems.filter(item => {
      switch (item.text) {
        case 'Редактировать': return hasAnyPrivilege(mine, privilegeOthers.edit)
        case 'Удалить': return hasAnyPrivilege(mine, privilegeOthers.delete)
      }
    })

    e.stopPropagation();
    setCmData(new ContextMenuData(e.clientX, e.clientY, true, filteredItems));
  }

  const _RolesContent = () => {
    return (
      <Content className={styles.content}>
        <div className={styles.top}>
          <Search onSearch={_onSearch} placeholder="Поиск роли" />
          {hasAnyPrivilege(privilegeContext.systemPrivileges, privilegeOthers.create)
            ? <Button onClick={_createRole} className={styles.create_button}>Создать роль</Button>
            : <></>}
        </div>
        <RoleList roles={_roles} onMenuClick={menuVisible ? _onMenuClick : undefined} />
      </Content>
    )
  }

  const _ContextMenu = () => {
    return <ContextMenu
      items={cmData.items}
      className={appendClassName(styles.context_menu,
        (cmData.visible ? styles.visible : styles.hidden))}
      ref={cmRef}
    />;
  }

  const _Dialog = () => {
    return (
      <Dialog
        className={appendClassName(styles.dialog,
          (dialogData.visible ? styles.visible : styles.hidden))}
        text={dialogData.heading}
        ref={dialogRef}
        onClose={_closeDialog}
      >
        {dialogData.content}
      </Dialog>
    )
  }

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={<PageName text="Список ролей" />}
      bottomLeft={<SideBar currentPageURL={RoutePaths.roleList} />}
      bottomRight={<_RolesContent />}
    >
      <_ContextMenu />
      <Fade
        className={appendClassName(styles.fade,
          (dialogData.visible) ? styles.visible : styles.hidden)}>
        <_Dialog />
      </Fade>
    </Layout>
  );
}

export default RoleListPage;
