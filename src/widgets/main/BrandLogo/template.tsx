import { ITMOLogo } from '@shared/ui/icons';
import styles from './index.module.css';

type Props = {
  onClick: () => void;
};

function BrandLogo(props: Props) {
  return <ITMOLogo className={styles.logo} onClick={props.onClick} />;
}

export default BrandLogo;
