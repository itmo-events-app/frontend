import { Home, Menu, Noted, Users } from '@shared/ui/icons';
import styles from './index.module.css';
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import Content from '@widgets/main/Content';
import SideBar, { SideBarTab } from '@widgets/main/SideBar';
import Input from "@widgets/main/Input";
import Button from "@widgets/main/Button";
import Dropdown, { DropdownOption } from "@widgets/main/Dropdown";

const _tabs: SideBarTab[] = [
  new SideBarTab('Мероприятия', <Menu />, [
    new SideBarTab('Доступные'),
    new SideBarTab('Участия'),
    new SideBarTab('Организуемые'),
    new SideBarTab('Создание', undefined, [], true),
  ], true, true),
  new SideBarTab('Площадки', <Home />, [
    new SideBarTab('Доступные'),
    new SideBarTab('Создание'),
  ]),
  new SideBarTab('Уведомления', <Noted />),
  new SideBarTab('Профиль', <Users />),

]

const _test_orgs: DropdownOption[] = [
  new DropdownOption("[408975] Григорьев Георгий Александрович"),
  new DropdownOption("[621304] Ефимов Евгений Николаевич"),
  new DropdownOption("[308820] Васильева Валентина Сергеевна"),
  new DropdownOption("[107589] Лебедев Леонид Петрович")
]

function EventCreationPage() {
  const _brandLogoClick = () => {
    console.log('brand logo!')
  }

  const _createEvent = () => {
    console.log('creating event!');
  }

  return (
    <Layout
      topLeft={<BrandLogo onClick={_brandLogoClick} />}
      topRight={<PageName text="Создание мероприятия" />}
      bottomLeft={<SideBar tabs={_tabs} />}
      bottomRight=
      {
        <Content>
          <div className={styles.event_form}>
            <div className={styles.event_form_item}>
              <Input type="text" placeholder="Введите название мероприятия" />
            </div>
            <div className={styles.event_form_item}>
              <Dropdown placeholder="Выберите главного организатора" items={_test_orgs} />
            </div>
            <div className={styles.event_form_button}>
              <Button onClick={_createEvent()}>Создать</Button>
            </div>
          </div>
        </Content>
      }
    />
  );
}

export default EventCreationPage;
