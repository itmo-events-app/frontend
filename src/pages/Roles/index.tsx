import { Home, Menu, Noted, Users } from '@shared/ui/icons';
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import SideBar, { SideBarTab } from '@widgets/main/SideBar';

const _PlainIcon = () => <div style={{ height: '24px', width: '24px' }}></div>;

const _tabs: SideBarTab[] = [
  new SideBarTab('Мероприятия', <Menu />, [
    new SideBarTab('Доступные'),
    new SideBarTab('Участия'),
    new SideBarTab('Организуемые'),
    new SideBarTab('Создание'),
  ], true),
  new SideBarTab('Площадки', <Home />, [
    new SideBarTab('Доступные'),
    new SideBarTab('Создание'),
  ]),
  new SideBarTab('Уведомления', <Noted />),
  new SideBarTab('Профиль', <Users />),

]

function RolesPage() {
  const _brandLogoClick = () => {
    console.log('brand logo!')
  }
  return (
    <Layout
      topLeft={<BrandLogo onClick={_brandLogoClick} />}
      topRight={<h1>Header</h1>}
      bottomLeft={<SideBar tabs={_tabs} />}
      bottomRight={<h1>Content</h1>}
    />
  );
}

export default RolesPage;
