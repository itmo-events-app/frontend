import { useNavigate } from "react-router-dom";
import { RoutePaths } from "@shared/config/routes.ts";
import styles from './index.module.css';
import { Home } from '@shared/ui/icons';
import Layout from "@widgets/main/Layout";
import PagedList, { PageEntry } from "@widgets/main/PagedList";
import BrandLogo from "@widgets/main/BrandLogo";
import PageName from "@widgets/main/PageName";
import SideBar from "@widgets/main/SideBar";
import Search from "@widgets/main/Search";
import Button from "@widgets/main/Button";
import Content from '@widgets/main/Content';
import Input from "@widgets/main/Input";
import Dropdown, { DropdownOption } from "@widgets/main/Dropdown";
import Label from "@widgets/auth/InputLabel";
import InputCheckbox from "@widgets/main/InputCheckbox";
import { useState } from "react";
import Dialog from "@widgets/main/Dialog";


const _test_places: DropdownOption[] = [
  new DropdownOption("Ломоносова, 9"),
  new DropdownOption("Кронверкский, 49"),
]

const CreatePlaceDialog = ({onClose}: { onClose: () => void }) => {

  const [format, setFormat] = useState(false);
  const _createPlace = () => {
    console.log('creating place!');
    onClose();
  }

  return (
      <div className={styles.dialog} onClick={onClose}>
          <Dialog className={styles.dialog_content} text={"Создание площадки"}>
            <div onClick={e => e.stopPropagation()}>
              <div className={styles.place_form}>
                <div className={styles.place_form_item}>
                  <Label value="Название" />
                  <Input type="text"/>
                </div>
                <div className={styles.place_form_item}>
                  <Label value="Адрес" />
                  <Dropdown  items={_test_places} placeholder="Выберите адрес" />
                </div>
                <div className={styles.place_form_item}>
                  <Label value="Формат" />
                  <InputCheckbox  checked={format} onChange={(e) => setFormat(e.target.checked)} text={"Зум"}/>
                </div>
                <div className={styles.place_form_item}>
                  <Label value="Аудитория" />
                  <Input type="text"/>
                </div>
                <div className={styles.place_form_item}>
                  <Label value="Описание" />
                  <Input type="text"/>
                </div>
                <div className={styles.place_form_button}>
                  <Button onClick={_createPlace}>Создать</Button>
                </div>
              </div>
            </div>
          </Dialog>

      </div>
  );
}
function AvailablePlacesPage() {

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const _brandLogoClick = () => {
    console.log('brand logo!')
  }
  const _onSearch = () => {
    console.log('searching')
  }
  const _onCreation = () => {
    console.log('creating')
    // navigate(RoutePaths.createPlace);
    openModal();
  }

  const navigate = useNavigate();
  const _event = () => {
    navigate(RoutePaths.placeData);
  }

  const _places: any[] = [
    new PageEntry(() => {return _entryStub(1, "Ломо", "Ломо, 9")}),
    new PageEntry(() => {return _entryStub(1, "Кронва", "Кронва, 49")})
  ]
  function _entryStub(index: number, name: string, address: string) {
    return (
      <a key={index} onClick={_event} className={styles.place_entry}>
        <Home className={styles.place_icon} />
        <div className={styles.place_info_column}>
          <div className={styles.place_name}>
            {name}
          </div>
          <div className={styles.place_address}>
            {address}
          </div>
        </div>
      </a>
    );
  }

  return (
    <>
      <Layout
        topLeft={<BrandLogo onClick={_brandLogoClick} />}
        topRight={<PageName text="Площадки" />}
        bottomLeft={<SideBar currentPageURL={RoutePaths.placeList} />}
        bottomRight= {
          <Content>
            <div className={styles.places_page}>
              <div className={styles.horizontal_bar}>
                <div className={styles.search}>
                  <Search onSearch={_onSearch} placeholder="Поиск" />
                </div>
                <div className={styles.button}>
                  <Button onClick={_onCreation}>Создать</Button>
                </div>
              </div>
              <div className={styles.event_list_container}>
                <PagedList page={1} page_size={5} page_step={5} items={_places} />
              </div>
            </div>
          </Content>
        }
      />
      {isModalOpen && <CreatePlaceDialog onClose={closeModal}/>}
    </>
  );
}

export default AvailablePlacesPage;
