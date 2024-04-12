import { Home, Menu, Noted, Users } from "@shared/ui/icons";
import styles from './index.module.css';
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import Content from '@widgets/main/Content';
import SideBar, { SideBarTab } from '@widgets/main/SideBar';
import Search from "@widgets/main/Search";
import Button from "@widgets/main/Button";
import PagedList, {PageEntry} from "@widgets/main/PagedList";
import { RoutePaths } from '@shared/config/routes';
import { useNavigate } from "react-router-dom";



function PlaceListPage() {

  const _onSearch = () => {
    console.log('searching')
  }

  const _onCreation = () => {
    console.log('creating')
  }
  const navigate = useNavigate();
  const _event = () => {
    navigate(RoutePaths.placeData);
  }
  const _places: any[] = [
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

  function _entryStub(index: number) {
    return (
      <a key={index} onClick={_event} className={styles.place_entry}>
        <Home className={styles.place_icon} />
        <div className={styles.place_info_column}>
          <div className={styles.place_name}>
            {"Корпус " + index}
          </div>
          <div className={styles.place_address}>
            Гривицова переулок 14-16
          </div>
        </div>
      </a>
    );
  }

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={<PageName text="Площадки" />}
      bottomLeft={<SideBar currentPageURL={RoutePaths.placeList} />}
      bottomRight=
      {
        <Content>
          
          <div className={styles.places_page}>
            <div className={styles.top_bar}>
              <div className={styles.search}>
                <Search onSearch={_onSearch} placeholder="Поиск" />
              </div>
              <div className={styles.button}>
                <Button onClick={_onSearch()}>Найти</Button>
              </div>
              <div className={styles.button}>
                <Button onClick={_onCreation}>Создать</Button>
              </div>
            </div>
            <div className={styles.place_list_container}>
            PagedList page={1} page_size={5} page_step={5} items={_places} />
            </div>
          </div>
        </Content>
      }
  
    />
  );
}

export default PlaceListPage;