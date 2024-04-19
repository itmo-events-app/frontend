import { useContext, useEffect, useState } from "react";
import ApiContext from "@features/api-context.ts";
import Dropdown, { DropdownOption } from "@widgets/main/Dropdown";
import { PlaceRequestFormatEnum } from "@shared/api/generated";
import { placeService } from "@features/place-service.ts";
import styles from "@pages/main/PlaceListPage/index.module.css";
import Dialog from "@widgets/main/Dialog";
import Label from "@widgets/auth/InputLabel";
import Input from "@widgets/main/Input";
import Button from "@widgets/main/Button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type EditPlaceFormValues = {
  format: DropdownOption<string>;
  name: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  roomName: string;
};

const UpdatePlaceDialog = ({ onClose, id }: { onClose: () => void, id: number }) => {
  const { api } = useContext(ApiContext);
  const placeFormat: DropdownOption<string>[] = [
    new DropdownOption("Онлайн"),
    new DropdownOption("Офлайн"),
    new DropdownOption("Гибрид"),
  ];
  const formatEnum: Record<string, PlaceRequestFormatEnum> = {
    "Онлайн": PlaceRequestFormatEnum.Online,
    "Офлайн": PlaceRequestFormatEnum.Offline,
    "Гибрид": PlaceRequestFormatEnum.Hybrid,
  };

  const formatTranslate: Record<string, string> = {
    "ONLINE": "Онлайн",
    "OFFLINE": "Офлайн",
    "HYBRID": "Гибрид",
  };

  const { data: foundPlace } = useQuery({ queryFn: () => placeService.getPlace(api, id), queryKey: ["getPlace"] });

  const { mutate: updatePlace } = useMutation({
    mutationFn: placeService.updatePlace,
    onSuccess: () => {
      invalidatePlaces();
    },
  });

  const queryClient = useQueryClient();

  const invalidatePlaces = () => {
    queryClient.invalidateQueries({ queryKey: ["getPlaces"] });
  };

  useEffect(() => {
    if (foundPlace) {
      const { name, address, longitude, latitude, description, format, room } = foundPlace;
      setValue("name", String(name));
      setValue("address", String(address));
      setValue("description", String(description));
      setValue("longitude", Number(longitude));
      setValue("latitude", Number(latitude));
      setValue("roomName", String(room));
      if (format) {
        console.log(format);
        const selectedDropdownOption = placeFormat.find(el => el.value === formatTranslate[format]);
        if (selectedDropdownOption) {
          setValue("format", selectedDropdownOption);
        }
      }
    }
  }, [foundPlace]);

  const { control, handleSubmit, setValue } = useForm<EditPlaceFormValues>();

  const [showEmptyFieldsMessage, setShowEmptyFieldsMessage] = useState(false);

  const onSubmit: SubmitHandler<EditPlaceFormValues> = async (values) => {
    const { name, address, roomName, format, longitude, latitude, description } = values;
    if (!name || !address || !roomName || !description) {
      setShowEmptyFieldsMessage(true);
      return;
    }

    updatePlace({
      api,
      id,
      name,
      description,
      latitude,
      longitude,
      format: formatEnum[format.value],
      address,
      room: roomName,
    });
    console.log(format)
    onClose();
  };

  return (
    <div className={styles.dialog} onClick={onClose}>
      <Dialog className={styles.dialog_content} text={"Редактирование площадки"}>
        <div onClick={e => e.stopPropagation()}>
          <form className={styles.place_form} onSubmit={handleSubmit(onSubmit)}>
            <Controller control={control} name={"name"}
                        render={({ field: { value, onChange } }) => (
                          <div className={styles.place_form_item}>
                            <Label value="Название" />
                            <Input type="text" placeholder={"Название"} value={value}
                                   onChange={(event) => onChange(event.target.value)} />
                          </div>
                        )}>
            </Controller>

            <Controller control={control} render={({ field: { value, onChange } }) => (
              <div className={styles.place_form_item}>
                <Label value="Адрес" />
                <Input type="text" placeholder={"Адрес"} value={value}
                       onChange={(event) => onChange(event.target.value)} />
              </div>
            )} name={"address"} />

            <Controller
              control={control}
              name={"format"}
              render={({ field: { value, onChange } }) => (
                <div className={styles.place_form_item}>
                  <Label value="Формат" />
                  <Dropdown items={placeFormat}
                            toText={(item) => item.value}
                            value={value}
                            onChange={onChange}
                  />
                </div>)}
            />

            <Controller control={control} name={"roomName"} render={({ field: { value, onChange } }) => (
              <div className={styles.place_form_item}>
                <Label value="Аудитория" />
                <Input type="text" placeholder={"Аудитория"} value={value}
                       onChange={(event) => onChange(event.target.value)} />
              </div>
            )}
            />

            <Controller control={control} name={"description"} render={({ field: { value, onChange } }) => (
              <div className={styles.place_form_item}>
                <Label value="Описание площадки" />
                <Input type="text" placeholder={"Описание"} value={value}
                       onChange={(event) => onChange(event.target.value)} />
              </div>
            )} />

            <Controller control={control} name={"latitude"} render={({ field: { value, onChange } }) => (
              <div className={styles.place_form_item}>
                <Label value="Долгота" />
                <Input type="number" placeholder={"Долгота"} value={String(value)}
                       onChange={(event) => {
                         onChange(Number(event.target.value));
                       }}
                       step={0.01}
                       min={-180}
                       max={180} />
              </div>
            )} />

            <Controller control={control} name={"longitude"} render={({ field: { value, onChange } }) => (
              <div className={styles.place_form_item}>
                <Label value="Широта" />
                <Input type="number" placeholder={"Широта"} value={String(value)}
                       onChange={(event) => onChange(Number(event.target.value))} step={0.01} min={-90} max={90} />
              </div>
            )} />

            <div className={styles.place_form_button}>
              <Button type="submit">Обновить</Button>
              {showEmptyFieldsMessage &&
                <span className={styles.emptyFieldsMessage}>Пожалуйста, заполните все поля</span>}
            </div>
          </form>
        </div>
      </Dialog>

    </div>
  );
};

export default UpdatePlaceDialog;
