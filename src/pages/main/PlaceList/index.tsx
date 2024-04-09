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


const _tabs: SideBarTab[] = [
  new SideBarTab('Мероприятия', <Menu />, [
    new SideBarTab('Доступные'),
    new SideBarTab('Участия'),
    new SideBarTab('Организуемые'),
    new SideBarTab('Создание'),
  ]),
  new SideBarTab('Площадки', <Home />, [
    new SideBarTab('Доступные',undefined, [], true),
    new SideBarTab('Создание'),
  ],true, true),
  new SideBarTab('Уведомления', <Noted />),
  new SideBarTab('Профиль', <Users />),

]

function PlaceListPage() {

  const _brandLogoClick = () => {
    console.log('brand logo!')
  }

  const _onSearch = () => {
    console.log('searching')
  }

  const _onCreation = () => {
    console.log('creating')
  }
  const navigate = useNavigate();
  const _place = () => {
    navigate(RoutePaths.placeList);
  }
  function _entryStub(index: number) {
    return (
      <a key={index} onClick={_place} className={styles.place_entry}>
        <Home className={styles.place_icon} />
        <div className={styles.place_info_column}>
          <div className={styles.place_name}>
            {"Корпус гривицова"}
          </div>
          <div className={styles.place_address}>
            Гривицова переулок 14-16
          </div>
        </div>
      </a>
    );
  }

  const _places: any[] = [
    new PageEntry(() => {return _entryStub(1)}),
    new PageEntry(() => {return _entryStub(2)}),
    new PageEntry(() => {return _entryStub(3)}),
    new PageEntry(() => {return _entryStub(4)}),
    new PageEntry(() => {return _entryStub(5)}),
    new PageEntry(() => {return _entryStub(6)}),
    new PageEntry(() => {return _entryStub(7)}),
    new PageEntry(() => {return _entryStub(8)}),
    new PageEntry(() => {return _entryStub(9)}),
    new PageEntry(() => {return _entryStub(10)}),
    new PageEntry(() => {return _entryStub(11)}),
    new PageEntry(() => {return _entryStub(12)})

  ]

  return (
    <Layout
      topLeft={<BrandLogo onClick={_brandLogoClick} />}
      topRight={<PageName text="Площадки" />}
      bottomLeft={<SideBar tabs={_tabs} />}
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
              <PagedList page={1} page_size={4} items={_places} />
            </div>
          </div>
        </Content>
      }
    />
  );
}

export default PlaceListPage;
