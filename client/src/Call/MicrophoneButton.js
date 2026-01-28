import { ReactComponent as MicOn } from '../assets/img/icon-microphone.svg';
import { ReactComponent as MicOff } from '../assets/img/icon-microphone-off.svg';
import IconToggleButton from '../Components/IconToggleButton';

export default function MicrophoneButton({ disabled, isMicOn, onClick }) {
  return <IconToggleButton disabled={disabled} selected={isMicOn} selectedIcon={<MicOn />} deselectedIcon={<MicOff />} onClick={onClick} />;
}
