import { ReactComponent as PhoneOff } from '../assets/img/icon-phone-off.svg';
import IconToggleButton from '../Components/IconToggleButton';

import './EndCallButton.scss';

export default function EndCallButton({ disabled, onClick }) {
  return (
    <IconToggleButton
      className="end-call-button"
      disabled={disabled}
      selected
      selectedIcon={<PhoneOff />}
      deselectedIcon={<PhoneOff />}
      onClick={onClick}
    />
  );
}
