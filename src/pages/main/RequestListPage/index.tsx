import BrandLogo from '@widgets/main/BrandLogo';
import PageName from '@widgets/main/PageName';
import SideBar from '@widgets/main/SideBar';
import { RoutePaths } from '@shared/config/routes.ts';
import Content from '@widgets/main/Content';
import Layout from '@widgets/main/Layout';

export default function RequestListPage() {
  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={<PageName text="Заявки на регистрацию" />}
      bottomLeft={<SideBar currentPageURL={RoutePaths.requestList} />}
      bottomRight={<Content>Content</Content>}
    />
  );
}
