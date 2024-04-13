import BrandLogo from "@widgets/main/BrandLogo";
import Layout from "@widgets/main/Layout";
import PageName from "@widgets/main/PageName";
import styles from "./index.module.css";
import SideBar from "@widgets/main/SideBar";
import { RoutePaths } from "@shared/config/routes.ts";
import Content from "@widgets/main/Content";
import { useContext } from "react";
import ApiContext from "@features/api-context.ts";
import { useQuery } from "@tanstack/react-query";
import { placeService } from "@features/place-service.ts";
import { useParams } from "react-router-dom";


function PlaceDataPage() {
  const { api } = useContext(ApiContext);

  const { place_id: placeId } = useParams();

  const { data: foundPlace } = useQuery({
    queryFn: () => placeService.getPlace(api, Number(placeId)),
    enabled: placeId !== undefined,
    queryKey: ["getPlace"],
  });

  const formatTranslation: Record<string, string> = {
    "ONLINE": "Онлайн",
    "OFFLINE": "Офлайн",
    "HYBRID": "Гибрид"
  };

  return (
    <Layout
      topLeft={<BrandLogo />}
      topRight={
        <div className={styles.header}>
          <PageName text={String(foundPlace?.name)} />
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
                <div className={styles.data}>{foundPlace?.address ?? ""}</div>
                <div className={styles.data}>{formatTranslation[foundPlace?.format!]}</div>
                <div className={styles.data}>{foundPlace?.room}</div>
                <div className={styles.data}>{`${foundPlace?.latitude ?? 0}, ${foundPlace?.longitude ?? 0}`}</div>
              </div>
            </div>
            <div className={styles.place_description}>
              <div className={styles.label}>Описание:</div>
              <div className={styles.data}>{foundPlace?.description}</div>
            </div>
          </div>
        </Content>
      }
    />
  );
}

export default PlaceDataPage;
