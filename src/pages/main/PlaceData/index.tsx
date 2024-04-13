import BrandLogo from "@widgets/main/BrandLogo";
import Layout from "@widgets/main/Layout";
import PageName from "@widgets/main/PageName";
import styles from './index.module.css';
import SideBar from "@widgets/main/SideBar";
import { RoutePaths } from "@shared/config/routes.ts";
import Content from "@widgets/main/Content";


class PlaceInfo {
  placeName: string
  address: string
  format: string
  room: string
  coordinates: string
  description: string
  constructor(
    placeName: string,
    address: string,
    format: string,
    room: string,
    coordinates: string,
    description: string,
  ) {
    this.placeName = placeName;
    this.address = address;
    this.format = format;
    this.room = room;
    this.coordinates = coordinates;
    this.description = description;
  }
}

const _placeInfo: PlaceInfo = new PlaceInfo(
  "Площадка корпус ИТМО Ломоносова",
  "улица Ломоносова, д. 9",
  "очный",
  "ауд. 3210",
  "59.927209, 30.338281",
  "корпус для крутышек",
);

function PlaceDataPage() {
  return (
    <Layout
      topLeft={<BrandLogo/>}
      topRight={
        <div className={styles.header}>
          <PageName text={_placeInfo.placeName}/>
        </div>
      }
      bottomLeft={<SideBar currentPageURL={RoutePaths.placeData} />}
      bottomRight={
        <Content>
          <div className={styles.place_data}>
            <div className={styles.place_data_list}>
              <div className={styles.place_column}>
                <div className={styles.label}>Адрес:</div>
                <div className={styles.label}>Формат:</div>
                <div className={styles.label}>Аудитория:</div>
                <div className={styles.label}>Координаты:</div>
              </div>
              <div className={styles.place_column}>
                <div className={styles.data}>{_placeInfo.address}</div>
                <div className={styles.data}>{_placeInfo.format}</div>
                <div className={styles.data}>{_placeInfo.room}</div>
                <div className={styles.data}>{_placeInfo.coordinates}</div>
              </div>
            </div>
            <div className={styles.place_description}>
              <div className={styles.label}>Описание:</div>
              <div className={styles.data}>{_placeInfo.description}</div>
            </div>
          </div>
        </Content>
      }
    />
  );
}

export default PlaceDataPage;
