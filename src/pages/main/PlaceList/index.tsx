import styles from './index.module.css';
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import Content from '@widgets/main/Content';
import SideBar from '@widgets/main/SideBar';
import Search from "@widgets/main/Search";
import PagedList, { PageEntry } from "@widgets/main/PagedList";
import { RoutePaths } from '@shared/config/routes';
import Button from '@widgets/main/Button';
import Input from '@widgets/main/Input';
import Dropdown, { DropdownOption } from '@widgets/main/Dropdown';
import { appendClassName } from '@shared/util';
import { useEffect, useRef, useState } from 'react';
import Fade from '@widgets/main/Fade';
import Dialog from '@widgets/main/Dialog';
import TextArea from '@widgets/main/TextArea';

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

function _entryStub(index: number) {
  return (
    <div key={index} className={styles.event_entry}>
      <div className={styles.event_info_column}>
        <div className={styles.event_name}>
          {"Площадка " + index}
        </div>
      </div>
    </div>
  );
}

const _test_orgs: DropdownOption[] = [
  new DropdownOption("[408975] Григорьев Георгий Александрович"),
  new DropdownOption("[621304] Ефимов Евгений Николаевич"),
  new DropdownOption("[308820] Васильева Валентина Сергеевна"),
  new DropdownOption("[107589] Лебедев Леонид Петрович")
]

const _events: any[] = [
  new PageEntry(() => { return _entryStub(1) }),
  new PageEntry(() => { return _entryStub(2) }),
  new PageEntry(() => { return _entryStub(3) }),
  new PageEntry(() => { return _entryStub(4) }),
  new PageEntry(() => { return _entryStub(5) }),
  new PageEntry(() => { return _entryStub(6) }),
  new PageEntry(() => { return _entryStub(7) }),
  new PageEntry(() => { return _entryStub(8) }),
  new PageEntry(() => { return _entryStub(9) }),
  new PageEntry(() => { return _entryStub(10) }),
  new PageEntry(() => { return _entryStub(11) }),
  new PageEntry(() => { return _entryStub(12) }),
  new PageEntry(() => { return _entryStub(13) }),
  new PageEntry(() => { return _entryStub(14) }),
  new PageEntry(() => { return _entryStub(15) }),
  new PageEntry(() => { return _entryStub(16) }),
  new PageEntry(() => { return _entryStub(17) }),
  new PageEntry(() => { return _entryStub(18) }),
  new PageEntry(() => { return _entryStub(19) }),
  new PageEntry(() => { return _entryStub(20) }),
  new PageEntry(() => { return _entryStub(21) }),
  new PageEntry(() => { return _entryStub(22) }),
  new PageEntry(() => { return _entryStub(23) }),
  new PageEntry(() => { return _entryStub(24) }),
  new PageEntry(() => { return _entryStub(25) }),
  new PageEntry(() => { return _entryStub(26) }),
  new PageEntry(() => { return _entryStub(27) }),
  new PageEntry(() => { return _entryStub(28) }),
  new PageEntry(() => { return _entryStub(29) }),
  new PageEntry(() => { return _entryStub(30) }),
  new PageEntry(() => { return _entryStub(31) }),
  new PageEntry(() => { return _entryStub(32) }),
  new PageEntry(() => { return _entryStub(33) })
]

function PlaceListPage() {
  const [dialogData, setDialogData] = useState(new DialogData());
  const dialogRef = useRef(null);

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

  const _onSearch = () => {
    console.log('searching')
  }

  const _createRole = (e: MouseEvent) => {
    setDialogData(new DialogData('Создание площадки', _CreateRoleDialogContent({ onDone: _closeDialog }), true));
    e.stopPropagation();
  }

  const _CreateRoleDialogContent = (props: { onDone: any }) => {
    return (
      <div className={styles.event_form}>
        <div className={styles.event_form_item}>
          <Input type="text" placeholder="Введите название площадки" />
        </div>
        <div className={styles.event_form_item}>
          <TextArea placeholder="Описание" />
        </div>
        <div className={styles.event_form_item}>
          <Input type="text" placeholder="Адрес" />
        </div>
        <div className={styles.event_form_item}>
          <Input type="text" placeholder="Широта" />
        </div>
        <div className={styles.event_form_item}>
          <Input type="text" placeholder="Долгота" />
        </div>
        <div className={styles.event_form_button}>
          <Button onClick={props.onDone}>Создать</Button>
        </div>
      </div>
    );
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
      topRight={<PageName text="Площадки" />}
      bottomLeft={<SideBar currentPageURL={RoutePaths.placeList} />}
      bottomRight=
      {
        <Content>
          <div className={styles.events_page}>
            <div className={styles.horizontal_bar}>
              <div className={styles.search}>
                <Search onSearch={_onSearch} placeholder="Поиск" />
              </div>
              <div className={styles.button}>
                <Button onClick={_createRole}>Создать</Button>
              </div>
            </div>
            <div className={styles.event_list_container}>
              <PagedList page={1} page_size={5} page_step={5} items={_events} />
            </div>
          </div>
        </Content>
      }
    >
      <Fade
        className={appendClassName(styles.fade,
          (dialogData.visible) ? styles.visible : styles.hidden)}>
        <_Dialog />
      </Fade>
    </Layout >
  );
}

export default PlaceListPage;
