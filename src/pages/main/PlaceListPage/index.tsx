import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@shared/config/routes.ts';
import styles from './index.module.css';
import { Home } from '@shared/ui/icons';
import Layout from '@widgets/main/Layout';
import PagedList, { PageEntry } from '@widgets/main/PagedList';
import BrandLogo from '@widgets/main/BrandLogo';
import PageName from '@widgets/main/PageName';
import SideBar from '@widgets/main/SideBar';
import Search from '@widgets/main/Search';
import Button from '@widgets/main/Button';
import Content from '@widgets/main/Content';
import Input from '@widgets/main/Input';
import Label from '@widgets/auth/InputLabel';
import { useContext, useState } from 'react';
import Dialog from '@widgets/main/Dialog';
import { useQuery } from '@tanstack/react-query';
import { placeService } from '@features/place-service.ts';
import ApiContext from '@features/api-context.ts';
import { PlaceRequestFormatEnum, PlaceResponse } from '@shared/api/generated';
import Dropdown, { DropdownOption } from '@widgets/main/Dropdown';

const CreatePlaceDialog = ({ onClose }: { onClose: () => void }) => {
  const { api } = useContext(ApiContext);
  const placeFormat: DropdownOption<string>[] = [
    new DropdownOption('Онлайн'),
    new DropdownOption('Офлайн'),
    new DropdownOption('Гибрид'),
  ];
  const formatEnum: Record<string, PlaceRequestFormatEnum> = {
    Онлайн: PlaceRequestFormatEnum.Online,
    Офлайн: PlaceRequestFormatEnum.Offline,
    Гибрид: PlaceRequestFormatEnum.Hybrid,
  };
  const [format, setFormat] = useState<DropdownOption<string>>(placeFormat[1]);
  const [placeName, setPlaceName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [address, setAddress] = useState('');
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
      longitude
    );
    onClose();
    location.reload();
  };

  return (
    <div className={styles.dialog} onClick={onClose}>
      <Dialog className={styles.dialog_content} text={'Создание площадки'}>
        <div onClick={(e) => e.stopPropagation()}>
          <div className={styles.place_form}>
            <div className={styles.place_form_item}>
              <Label value="Название" />
              <Input
                type="text"
                placeholder={'Название'}
                value={placeName}
                onChange={(event) => setPlaceName(event.target.value)}
              />
            </div>
            <div className={styles.place_form_item}>
              <Label value="Адрес" />
              <Input
                type="text"
                placeholder={'Адрес'}
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </div>
            <div className={styles.place_form_item}>
              <Label value="Формат" />
              <Dropdown
                items={placeFormat}
                toText={(item) => item.value}
                value={format}
                onChange={(sel) => {
                  setFormat(sel);
                }}
              />
            </div>
            <div className={styles.place_form_item}>
              <Label value="Аудитория" />
              <Input
                type="text"
                placeholder={'Аудитория'}
                value={roomName}
                onChange={(event) => setRoomName(event.target.value)}
              />
            </div>
            <div className={styles.place_form_item}>
              <Label value="Описание площадки" />
              <Input
                type="text"
                placeholder={'Описание'}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div className={styles.place_form_item}>
              <Label value="Долгота" />
              <Input
                type="number"
                placeholder={'Долгота'}
                value={String(latitude)}
                onChange={(event) => {
                  setLatitude(Number(event.target.value));
                }}
                step={0.01}
                min={-180}
                max={180}
              />
            </div>
            <div className={styles.place_form_item}>
              <Label value="Широта" />
              <Input
                type="number"
                placeholder={'Широта'}
                value={String(longitude)}
                onChange={(event) => setLongitude(Number(event.target.value))}
                step={0.01}
                min={-90}
                max={90}
              />
            </div>
            <div className={styles.place_form_button}>
              <Button onClick={createPlace}>Создать</Button>
              {showEmptyFieldsMessage && (
                <span className={styles.emptyFieldsMessage}>Пожалуйста, заполните все поля</span>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

function PlaceListPage() {
  const { api } = useContext(ApiContext);

  const [isModalOpen, setModalOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const { data: foundPlaces = [] } = useQuery({
    queryFn: placeService.getPlaces(api),
    queryKey: ['getPlaces'],
  });

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const _onSearch = () => {
    console.log('searching');
  };

  const _onCreation = () => {
    openModal();
  };

  const navigate = useNavigate();
  const _event = (id: number) => {
    navigate(`${id}`);
  };

  const _places: PageEntry[] = foundPlaces.map((place: PlaceResponse) => {
    return new PageEntry(() => {
      return _entryStub(place.id, place.name, place.address);
    });
  });

  function _entryStub(index?: number, name?: string, address?: string) {
    return (
      <a key={index} onClick={() => _event(index ?? 0)} className={styles.place_entry}>
        <Home className={styles.place_icon} />
        <div className={styles.place_info_column}>
          <div className={styles.place_name}>{name}</div>
          <div className={styles.place_address}>{address}</div>
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
                  <Search
                    onSearch={_onSearch}
                    placeholder="Поиск"
                    value={searchName}
                    onChange={(event) => {
                      setSearchName(event.target.value);
                    }}
                  />
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

export default PlaceListPage;
