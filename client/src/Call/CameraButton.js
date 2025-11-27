import { ReactComponent as CameraOn } from '../assets/img/icon-video.svg';
import { ReactComponent as CameraOff } from '../assets/img/icon-video-off.svg';
import IconToggleButton from '../Components/IconToggleButton';

export default function CameraButton({ disabled, isCameraOn, onClick }) {
  return (
    <IconToggleButton
      disabled={disabled}
      selected={isCameraOn}
      selectedIcon={<CameraOn />}
      deselectedIcon={<CameraOff />}
      onClick={onClick}
    />
  );
}
