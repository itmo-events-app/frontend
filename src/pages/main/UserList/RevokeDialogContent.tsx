import styles from './index.module.css';
import Button from '@widgets/main/Button';

type AssignProps = {
  userId: number;
  onDone: (userId: number) => void;
};

const RevokeDialogContent = (props: AssignProps) => {
  const _onDoneWrapper = () => {
    props.onDone(props.userId);
  };

  return (
    <div className={styles.dialog_content}>
      <div className={styles.dialog_form}>
        <div className={styles.dialog_item}>
          <div className={styles.dialog_text}>
            <p>При снятии роли с пользоателя, пользоателю выдастся роль "Читатель".</p>
            <p>Подтвердите действие.</p>
          </div>
        </div>
      </div>
      <Button onClick={_onDoneWrapper}>Снять роль</Button>
    </div>
  );
};

export default RevokeDialogContent;
