import styles from './index.module.css';
import Dialog from '@widgets/main/Dialog';
import Button from '@widgets/main/Button';
import { useContext, useState } from 'react';
import ApiContext from '@features/api-context';
import { taskService } from '@features/task-service';

const AddTaskDialog = ({ onClose, idInt }: { onClose: () => void; idInt: number }) => {
  const { api } = useContext(ApiContext);
  const [files, setFiles] = useState<File[] | undefined>(undefined);
  const [isShowFileError, setIsShowFileError] = useState(false);

  function loadFile() {
    if (files) {
      taskService
        .uploadFiles(api, idInt, files)
        .then(() => {
          onClose();
        })
        .catch((): any => {
          setIsShowFileError(true);
        });
    }
  }

  return (
    <div className={styles.dialog_task} onClick={onClose}>
      <Dialog className={styles.dialog_content_task} text={'Прикрепить файлы'}>
        <div onClick={(e) => e.stopPropagation()}>
          <div className={styles.place_form}>
            <div className={styles.place_form_item}>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setFiles([...e.target.files]);
                  }
                }}
              />
              <div>
                {files && <a>Выбраны: </a>}
                {files && files.map((f) => <a key={f.name}> {f.name} </a>)}
              </div>
              {isShowFileError && (
                <span className={styles.emptyFieldsMessage}>Суммарный размер файлов слишком большой</span>
              )}
            </div>
            <div className={styles.place_form_button}>
              <Button onClick={loadFile}>Загрузить</Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
export default AddTaskDialog;
