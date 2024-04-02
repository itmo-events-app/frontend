import styles from './index.module.css';
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import Content from '@widgets/main/Content';
import SideBar from '@widgets/main/SideBar';
import Search from "@widgets/main/Search";
import PagedList, { PageEntry } from "@widgets/main/PagedList";
import { RoutePaths } from '@shared/config/routes';
import Dropdown, { DropdownOption } from '@widgets/main/Dropdown';

function _entryStub(index: number) {
  return (
    <div key={index} className={styles.event_entry}>
      <div className={styles.event_info_column}>
        <div className={styles.event_name}>
          {"Имя" + index + " Фамилия" + index}
        </div>
        <Dropdown items={[new DropdownOption("Администратор"), new DropdownOption("Пользователь")]} placeholder='Администратор'/>
      </div>
    </div>
  );
}

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

function UserListPage() {

  const _onSearch = () => {
    console.log('searching')
  }

  const _onCreation = () => {
    console.log('creating')
  }

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={<PageName text="Пользователи" />}
      bottomLeft={<SideBar currentPageURL={RoutePaths.userList} />}
      bottomRight=
      {
        <Content>
          <div className={styles.events_page}>
            <div className={styles.horizontal_bar}>
              <div className={styles.search}>
                <Search onSearch={_onSearch} placeholder="Поиск" />
              </div>
            </div>
            <div className={styles.event_list_container}>
              <PagedList page={1} page_size={5} page_step={5} items={_events} />
            </div>
          </div>
        </Content>
      }
    />
  );
}

export default UserListPage;
