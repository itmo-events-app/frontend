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
import Label from "@widgets/auth/InputLabel";
import { useContext, useEffect, useState } from "react";
import Dialog from "@widgets/main/Dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { placeService } from "@features/place-service.ts";
import ApiContext from "@features/api-context.ts";
import { PlaceRequestFormatEnum, PlaceResponse } from "@shared/api/generated";
import { DropdownOption } from "@widgets/main/Dropdown";
import { hasAnyPrivilege } from "@features/privileges.ts";
import { PrivilegeData } from "@entities/privilege-context.ts";
import { PrivilegeNames } from "@shared/config/privileges.ts";
import PrivilegeContext from "@features/privilege-context.ts";
import UpdatePlaceDialog from "@pages/main/PlaceListPage/UpdatePlaceContext.tsx";


const CreatePlaceDialog = ({ onClose }: { onClose: () => void }) => {
  const { api } = useContext(ApiContext);
  const placeFormat: DropdownOption<string>[] = [
    new DropdownOption("Онлайн"),
    new DropdownOption("Офлайн"),
    new DropdownOption("Гибрид"),
  ];
  const formatEnum: Record<string, PlaceRequestFormatEnum> = {
    Онлайн: PlaceRequestFormatEnum.Online,
    Офлайн: PlaceRequestFormatEnum.Offline,
    Гибрид: PlaceRequestFormatEnum.Hybrid,
  };
  const [format, _] = useState<DropdownOption<string>>(placeFormat[1]);
  const [placeName, setPlaceName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(30.3095);
  const [longitude, setLongitude] = useState(59.9567);
  const [address, setAddress] = useState("Кронверкский проспект, 49");
  const [showEmptyFieldsMessage, setShowEmptyFieldsMessage] = useState(false);

  const createPlace = () => {
    if (!placeName || !address || !roomName || !description) {
      setShowEmptyFieldsMessage(true);
      return;
    }
    placeService.createPlace(
      api,
      placeName,
      address,
      formatEnum[format.value],
      roomName,
      description,
      latitude,
      longitude,
    ).then(() => onClose());
  };
  const handleMapClick = (message: any) => {
    const childWindow = document.querySelector("iframe")?.contentWindow;
    if (message.source !== childWindow) return;
    setAddress(message.data.address);
    setRoomName(message.data.properties?.ref ?? "");
    setLatitude(message.data.coordinates[0]);
    setLongitude(message.data.coordinates[1]);
  };
  useEffect(() => {
    window.addEventListener("message", handleMapClick);
  });
  return (
    <div className={styles.dialog} onClick={onClose}>
      <Dialog className={styles.dialog_content} text={"Создание площадки"}>
        <div onClick={(e) => e.stopPropagation()}>
          <div className={styles.place_form}>
            <div className={styles.place_form_item}>
              <Label value="Название" />
              <Input
                type="text"
                placeholder={"Название"}
                value={placeName}
                onChange={(event) => setPlaceName(event.target.value)}
              />
            </div>
            <div className={styles.place_form_item}>
              <Label value="Описание площадки" />
              <Input
                type="text"
                placeholder={"Описание"}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div className={styles.place_form_item}>
              <Label value="Адрес" />
              <Input
                type="text"
                placeholder={"Адрес"}
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </div>
            <div className={styles.place_form_item}>
              <Label value="Аудитория" />
              <Input
                type="text"
                placeholder={"Можно выбрать на карте"}
                value={roomName}
                onChange={(event) => {
                  setRoomName(event.target.value);
                  (document.getElementById("itmo-map-iframe") as HTMLIFrameElement)?.contentWindow?.postMessage({
                    type: "roomHighlight",
                    room: event.target.value,
                  }, "*");
                }
                }
              />
            </div>
            <div className={styles.place_form_item}>
              {/*<Label value="Долгота" />*/}
              <Input
                // type="number"
                placeholder={"Долгота"}
                value={String(latitude)}
                onChange={(event) => {
                  setLatitude(Number(event.target.value));
                }}
                min={-180}
                max={180}
                hidden={true}
              />
            </div>
            <div className={styles.place_form_item}>
              {/*<Label value="Широта" />*/}
              <Input
                hidden={true}
                // type="number"
                placeholder={"Широта"}
                value={String(longitude)}
                onChange={(event) => setLongitude(Number(event.target.value))}
                min={-90}
                max={90}
              />
            </div>
            <iframe id="itmo-map-iframe" src={(window as any).ENV_GEO_URL + "/map.html?noscroll&select_only_areas"}
              width="100%" height="420px"></iframe>
            <div className={styles.place_form_button}>
              <Button onClick={createPlace}>Создать</Button>
            </div>
            {showEmptyFieldsMessage && (
              <span className={styles.emptyFieldsMessage}>Пожалуйста, заполните все поля</span>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

function PlaceListPage() {
  const DEFAULT_PLACES_COUNT = 4; // по-хорошему дефолтность площадки должна хранится в бд
  const { api } = useContext(ApiContext);
  const { privilegeContext } = useContext(PrivilegeContext);

  const { data: allPlaces = [], refetch } = useQuery({
    queryFn: placeService.getPlaces(api),
    queryKey: ["getPlaces"],

  });

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [id, setId] = useState<number>(0);
  const [searchName, setSearchName] = useState("");

  const [filteredPlaces, setFilteredPlaces] = useState<PlaceResponse[]>(allPlaces);

  const { mutate: getFilteredPlaces } = useMutation({
    mutationFn: placeService.getFilteredPlaces(api),
    mutationKey: ["getFilteredPlaces"],
    onSuccess: (res) => {
      setFilteredPlaces(res);
    },
  });

  useEffect(() => {
    setFilteredPlaces(allPlaces);
  }, [allPlaces]);

  const openModalCreate = () => {
    setCreateModalOpen(true);
  };

  const closeModalCreate = () => {
    refetch().then(() => setCreateModalOpen(false));
  };

  const openModalUpdate = () => {
    setUpdateModalOpen(true);
  };

  const closeModalUpdate = () => {
    refetch().then(() => setUpdateModalOpen(false));
  };

  const _onSearch = () => {
    if (searchName !== "") {
      getFilteredPlaces({ name: searchName });
    } else setFilteredPlaces(allPlaces);
  };

  const _onCreation = () => {
    openModalCreate();
  };

  const _onUpdate = (id: number) => {
    setId(id);
    openModalUpdate();
  };

  const _onDelete = (id: number) => {
    placeService.deletePlace(api, id);
    setTimeout(() => {
      location.reload();
    }, 500);
  };

  const navigate = useNavigate();
  const _event = (id: number) => {
    navigate(`${id}`);
  };

  const _places: PageEntry[] = filteredPlaces.map((place: PlaceResponse) => {
    return new PageEntry(() => {
      return _entryStub(place.id, place.name, place.address);
    });
  });


  function _entryStub(index?: number, name?: string, address?: string) {
    return (
      <div key={index}>
        <a className={styles.place_entry}>
          <Home className={styles.place_icon} onClick={() => _event(index ?? 0)} />
          <div className={styles.place_info_column} onClick={() => _event(index ?? 0)}>
            <div className={styles.place_name}>
              {name}
            </div>
            <div className={styles.place_address}>
              {address}
            </div>
          </div>
          <div className={styles.place_buttons}>
            {hasAnyPrivilege(privilegeContext.systemPrivileges, new Set([
              new PrivilegeData(PrivilegeNames.CREATE_EVENT_VENUE),
            ])) ? <div className={styles.button}>
              <Button onClick={() => _onUpdate(index!)}>Редактировать</Button>
            </div>
              : <></>}
            {hasAnyPrivilege(privilegeContext.systemPrivileges, new Set([
              new PrivilegeData(PrivilegeNames.DELETE_EVENT_VENUE),
            ])) ? <div>
              <Button className={styles.delete_button} onClick={() => {
                if (window.confirm(`Удалить площадку ${name} ?`)) {
                  _onDelete(index!);
                }
              }} disabled={(index ?? 0) <= DEFAULT_PLACES_COUNT}
                title={(index ?? 0) <= DEFAULT_PLACES_COUNT ? "Эту площадку нельзя удалить" : ""}>
                <svg className={styles.delete_button_svg} xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                  fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            </div>
              : <></>}
          </div>
        </a>
      </div>
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
                  <Search
                    onSearch={_onSearch}
                    placeholder="Поиск"
                    value={searchName}
                    onChange={(event) => {
                      setSearchName(event.target.value);
                    }}
                  />
                </div>
                {hasAnyPrivilege(privilegeContext.systemPrivileges, new Set([
                  new PrivilegeData(PrivilegeNames.CREATE_EVENT_VENUE),
                ])) ? <div className={styles.button}>
                  <Button onClick={_onCreation}>Создать</Button>
                </div>
                  : <></>}
              </div>
              <div className={styles.event_list_container}>
                <PagedList page={1} page_size={5} page_step={1} items={_places} />
              </div>
            </div>
          </Content>
        }
      />
      {isCreateModalOpen && <CreatePlaceDialog onClose={closeModalCreate} />}
      {isUpdateModalOpen && <UpdatePlaceDialog onClose={closeModalUpdate} id={id} />}
    </>
  );
}

export default PlaceListPage;
