import styles from './index.module.css';
import BrandLogo from '@widgets/main/BrandLogo';
import Layout from '@widgets/main/Layout';
import PageName from '@widgets/main/PageName';
import Content from '@widgets/main/Content';
import SideBar, { SideBarTab } from "@widgets/main/SideBar";
import Input from "@widgets/main/Input";
import Button from "@widgets/main/Button";
// import Dropdown, { DropdownOption } from "@widgets/main/Dropdown";
// import { RoutePaths } from '@shared/config/routes';
import { Home, Menu, LocationIcon, Noted, Users } from "@shared/ui/icons";
import InputLabel from "@widgets/auth/InputLabel";
import InputCheckbox from "@widgets/main/InputCheckbox";
import TextArea from "@widgets/main/TextArea";
import Dropzone from "@widgets/main/Dropzone";
import { useCallback, useState } from "react";


const _tabs: SideBarTab[] = [
  new SideBarTab('Мероприятия', <Menu />, [
    new SideBarTab('Доступные'),
    new SideBarTab('Участия'),
    new SideBarTab('Организуемые'),
    new SideBarTab('Создание'),
  ]),
  new SideBarTab('Площадки', <Home />, [
    new SideBarTab('Доступные'),
    new SideBarTab('Создание',undefined, [], true),
  ],true, true),
  new SideBarTab('Уведомления', <Noted />),
  new SideBarTab('Профиль', <Users />),

]

function PlaceCreationPage() {
  const _brandLogoClick = () => {
    console.log('brand logo!')
  }

  const _createPlace = () => {
    console.log('creating place!');
  }

  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = useCallback((droppedFiles: File[]) => {
    setFiles(droppedFiles);
  }, []);


  return (
    <Layout
      topLeft={<BrandLogo onClick={_brandLogoClick} />}
      topRight={<PageName text="Площадка" />}
      bottomLeft={<SideBar tabs={_tabs} />}
      // bottomLeft={<SideBar currentPageURL={RoutePaths.createPlace} />}
      bottomRight=
      {
        <Content>
          <div className={styles.place_form}>
            <div className={styles.place_form_item}>
              <InputLabel value={"Название площадки"} />
              <Input type="text" placeholder="Корпус ИТМО Горьковская" />
            </div>
            <div className={styles.place_form_item}>
              <InputCheckbox text={"Зум"} checked={true} />
            </div>
            <div className={styles.place_form_item}>
              <InputLabel value={"Адрес"} />
              <Input type="text" placeholder="Кронверкский, 49" />
            </div>
            <div className={styles.place_form_item}>
              <InputLabel value={"Аудитория"} />
              <Input type="text" placeholder="3456, 4 этаж" />
            </div>
            <div className={styles.place_form_item}>
              <InputLabel value={"Расположение на карте"} />
              <LocationIcon className={styles.place_icon} />
            </div>
            <div className={styles.place_form_item}>
              <InputLabel value={"Дополнительная информация"} />
              <TextArea placeholder="Время работы: Пн-Сб 9:00 - 20:00                Официальная одежда: требуется"
                        className={styles.place_textArea} maxLength={500}/>
            </div>
            <div className={styles.place_form_item}>
              <InputLabel value={"Фото"} />
              <Dropzone
                onDrop={handleDrop}
                acceptType="image/*"
                maxFileSize={2 * 1024 ** 2} // Limit to 2 MB for images
              />
              {files.length > 0 && (
                <>
                  <ul>
                    {files.map((file, index) => (
                      <li key={index}>
                        {file.name} ({file.type}) - {(file.size / 1024).toFixed(2)} KB
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div className={styles.place_form_button}>
              <Button onClick={_createPlace()}>Создать</Button>
            </div>
          </div>
        </Content>
      }
    />
  );
}

export default PlaceCreationPage;
