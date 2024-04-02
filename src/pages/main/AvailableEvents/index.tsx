import {Home, Menu, Noted, ReactLogo, Users} from '@shared/ui/icons';
import styles from './index.module.css';
import { useLayoutEffect, useState } from 'react'
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import Content from '@widgets/main/Content';
import SideBar, { SideBarTab } from '@widgets/main/SideBar';
import Search from "@widgets/main/Search";
import Dropdown, {DropdownOption} from "@widgets/main/Dropdown";
import Button from "@widgets/main/Button";
import PagedList, {PageEntry} from "@widgets/main/PagedList";

const _tabs: SideBarTab[] = [
  new SideBarTab('Мероприятия', <Menu />, [
    new SideBarTab('Доступные',undefined, [], true),
    new SideBarTab('Участия'),
    new SideBarTab('Организуемые'),
    new SideBarTab('Создание'),
  ], true, true),
  new SideBarTab('Площадки', <Home />, [
    new SideBarTab('Доступные'),
    new SideBarTab('Создание'),
  ]),
  new SideBarTab('Уведомления', <Noted />),
  new SideBarTab('Профиль', <Users />),

]

const _displayModes: DropdownOption[] = [
  new DropdownOption("Показать списком"),
  new DropdownOption("Показать на карте")
]

function _entryStub(index: number) {
  return (
    <div key={index} className={styles.event_entry}>
      <ReactLogo className={styles.event_icon}/>
      <div className={styles.event_info_column}>
        <div className={styles.event_name}>
          {"Event " + index}
        </div>
        <div className={styles.event_place}>
          Place
        </div>
      </div>
    </div>
  );
}

const _events: any[] = [
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
  new PageEntry(() => {return _entryStub(12)}),
  new PageEntry(() => {return _entryStub(13)}),
  new PageEntry(() => {return _entryStub(14)}),
  new PageEntry(() => {return _entryStub(15)}),
  new PageEntry(() => {return _entryStub(16)}),
  new PageEntry(() => {return _entryStub(17)}),
  new PageEntry(() => {return _entryStub(18)}),
  new PageEntry(() => {return _entryStub(19)}),
  new PageEntry(() => {return _entryStub(20)}),
  new PageEntry(() => {return _entryStub(21)}),
  new PageEntry(() => {return _entryStub(22)}),
  new PageEntry(() => {return _entryStub(23)}),
  new PageEntry(() => {return _entryStub(24)}),
  new PageEntry(() => {return _entryStub(25)}),
  new PageEntry(() => {return _entryStub(26)}),
  new PageEntry(() => {return _entryStub(27)}),
  new PageEntry(() => {return _entryStub(28)}),
  new PageEntry(() => {return _entryStub(29)}),
  new PageEntry(() => {return _entryStub(30)}),
  new PageEntry(() => {return _entryStub(31)}),
  new PageEntry(() => {return _entryStub(32)}),
  new PageEntry(() => {return _entryStub(33)})
]

function AvailableEventsPage() {

  function useWindowHeight() {

    const [height, setHeight] = useState(0);

    useLayoutEffect(() => {

      function updateHeight() {
        setHeight(window.innerHeight);
      }

      window.addEventListener("resize", updateHeight);
      updateHeight();

      return () => window.removeEventListener("resize", updateHeight);
    }, []);

    return height;
  }

  const _brandLogoClick = () => {
    console.log('brand logo!')
  }

  const _onSearch = () => {
    console.log('searching')
  }

  const _onCreation = () => {
    console.log('creating')
  }

  return (
    <Layout
      topLeft={<BrandLogo onClick={_brandLogoClick} />}
      topRight={<PageName text="Доступные мероприятия" />}
      bottomLeft={<SideBar tabs={_tabs} />}
      bottomRight=
      {
        <Content>
          <div className={styles.events_page}>
            <div className={styles.top_bar}>
              <div className={styles.search}>
                <Search onSearch={_onSearch} placeholder="Поиск" />
              </div>
              <div className={styles.dropdown}>
                <Dropdown value="Показать списком" placeholder="Режим отображения" items={_displayModes} />
              </div>
              <div className={styles.button}>
                <Button onClick={_onCreation()}>Создать</Button>
              </div>
              <>
              </>
            </div>
            <div className={styles.event_list_container}>
              <PagedList page={1} page_size={Math.max(1, Math.floor((useWindowHeight() - 250) / 125))} items={_events} />
            </div>
          </div>
        </Content>
      }
    />
  );
}

export default AvailableEventsPage;
