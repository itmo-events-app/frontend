import { useNavigate } from "react-router-dom";
import { RoutePaths } from "@shared/config/routes.ts";
import styles from "./index.module.css";
import { Home } from "@shared/ui/icons";
import Layout from "@widgets/main/Layout";
import PagedList, { PageEntry } from "@widgets/main/PagedList";
import BrandLogo from "@widgets/main/BrandLogo";
import PageName from "@widgets/main/PageName";
import SideBar from "@widgets/main/SideBar";
import Search from "@widgets/main/Search";
import Button from "@widgets/main/Button";
import Content from "@widgets/main/Content";
import Input from "@widgets/main/Input";
import Dropdown, { DropdownOption } from "@widgets/main/Dropdown";
import Label from "@widgets/auth/InputLabel";
import { useContext, useState } from "react";
import Dialog from "@widgets/main/Dialog";
import InputCheckbox from "@features/InputCheckbox";
import { useQuery } from "@tanstack/react-query";
import { placeService } from "@features/place-service.ts";
import ApiContext from "@features/api-context.ts";
import { PlaceResponse } from "@shared/api/generated";


const _test_places: DropdownOption<string>[] = [
  new DropdownOption("Ломоносова, 9"),
  new DropdownOption("Кронверкский, 49"),
];

const CreatePlaceDialog = ({ onClose }: { onClose: () => void }) => {

  const [isFormatOnline, setIsIsFormatOnline] = useState(false);
  const [placeName, setPlaceName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");

  const _createPlace = () => {
    console.log("creating place!");
    onClose();
  };

  return (
    <div className={styles.dialog} onClick={onClose}>
      <Dialog className={styles.dialog_content} text={"Создание площадки"}>
        <div onClick={e => e.stopPropagation()}>
          <div className={styles.place_form}>
            <div className={styles.place_form_item}>
              <Label value="Название" />
              <Input type="text" placeholder={"Название"} value={placeName}
                     onChange={(event) => setPlaceName(event.target.value)} />
            </div>
            <div className={styles.place_form_item}>
              <Label value="Адрес" />
              <Dropdown items={_test_places} placeholder="Выберите адрес" toText={(item) => item.value} />
            </div>
            <div className={styles.place_form_item}>
              <Label value="Формат" />
              <InputCheckbox item={{ selected: isFormatOnline, value: "Зум" }}
                             onChange={({ selected }) => setIsIsFormatOnline(selected)} />
            </div>
            <div className={styles.place_form_item}>
              <Label value="Аудитория" />
              <Input type="text" placeholder={"Аудитория"} value={roomName}
                     onChange={(event) => setRoomName(event.target.value)} />
            </div>
            <div className={styles.place_form_item}>
              <Label value="Описание площадки" />
              <Input type="text" placeholder={"Описание"} value={description}
                     onChange={(event) => setDescription(event.target.value)} />
            </div>
            <div className={styles.place_form_button}>
              <Button onClick={_createPlace}>Создать</Button>
            </div>
          </div>
        </div>
      </Dialog>

    </div>
  );
};

function AvailablePlacesPage() {
  const { api } = useContext(ApiContext);

  const [isModalOpen, setModalOpen] = useState(false);
  const [searchName, setSearchName] = useState("");
  const { data: foundPlaces = [] } = useQuery({
    queryFn: placeService.getPlaces(api),
    queryKey: ["getPlaces"],
  });

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const _onSearch = () => {
    console.log("searching");
  };
  const _onCreation = () => {
    console.log("creating");
    // navigate(RoutePaths.createPlace);
    openModal();
  };

  const navigate = useNavigate();
  const _event = (id: number) => {
    navigate(`${id}`);
  };

  const _places: any[] = foundPlaces.map((place: PlaceResponse) => {
      return new PageEntry(() => {
        return _entryStub(place.id, place.name, place.address);
      })
  })

  function _entryStub(index?: number, name?: string, address?: string) {
    return (
      <a key={index} onClick={() => _event(index ?? 0)} className={styles.place_entry}>
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
        topLeft={<BrandLogo />}
        topRight={<PageName text="Площадки" />}
        bottomLeft={<SideBar currentPageURL={RoutePaths.placeList} />}
        bottomRight={
          <Content>
            <div className={styles.places_page}>
              <div className={styles.horizontal_bar}>
                <div className={styles.search}>
                  <Search onSearch={_onSearch} placeholder="Поиск" value={searchName} onChange={(event) => {
                    setSearchName(event.target.value);
                  }} />
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
      {isModalOpen && <CreatePlaceDialog onClose={closeModal} />}
    </>
  );
}

export default AvailablePlacesPage;
