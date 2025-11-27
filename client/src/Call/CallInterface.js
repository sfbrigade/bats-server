import { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import {
  useConnectionState,
  useCurrentUID,
  useJoin,
  usePublish,
  useRemoteUsers,
  useRTCClient,
  LocalUser,
  RemoteUser,
} from 'agora-rtc-react';

import ApiService from '../ApiService';
import './CallInterface.scss';

export default function CallInterface({ channel }) {
  const client = useRTCClient();
  const [isCalling, setCalling] = useState(true);
  const { isConnected } = useJoin(async () => {
    const response = await ApiService.agora.getRtcToken(channel);
    const { token } = response.data;
    return {
      appid: window.env.REACT_APP_AGORA_APP_ID,
      channel,
      token,
    };
  }, isCalling);

  const uid = useCurrentUID() || 0;
  const [isMicOn, setMicOn] = useState(true);
  const [isCameraOn, setCameraOn] = useState(false);
  const connectionState = useConnectionState();

  const [localMicrophoneTrack, setLocalMicrophoneTrack] = useState();
  useEffect(() => {
    if (isConnected) {
      if (!localMicrophoneTrack && isMicOn) {
        AgoraRTC.createMicrophoneAudioTrack()
          .then((result) => {
            setLocalMicrophoneTrack(result);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, [client, isConnected, localMicrophoneTrack, isMicOn]);
  const [localCameraTrack, setLocalCameraTrack] = useState();
  useEffect(() => {
    if (isConnected) {
      if (!localCameraTrack && isCameraOn) {
        AgoraRTC.createCameraVideoTrack()
          .then((result) => {
            setLocalCameraTrack(result);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }, [client, isConnected, localCameraTrack, isCameraOn]);
  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();
  const [activeUser, setActiveUser] = useState();
  useEffect(() => {
    if (remoteUsers?.length > 0) {
      if (!activeUser) {
        setActiveUser(remoteUsers[0]);
      }
    } else {
      setActiveUser();
    }
  }, [remoteUsers, activeUser]);

  return (
    <div className="grid-row call-interface">
      <div className="tablet:grid-col-9">
        <div className="remote-user">
          {activeUser && <RemoteUser user={activeUser} playAudio playVideo videoPlayerConfig={{ fit: 'contain' }} />}
        </div>
        {isConnected && (
          <div className="local-user">
            <LocalUser
              audioTrack={localMicrophoneTrack}
              cameraOn={isCameraOn}
              micOn={isMicOn}
              playAudio={false}
              playVideo
              videoTrack={localCameraTrack}
            />
          </div>
        )}
      </div>
      <div className="tablet:grid-col-3">
        <div>UID: {uid}</div>
        <div>
          Connected: {JSON.stringify(isConnected)} | {connectionState}
        </div>
        <div>
          <button onClick={() => setCalling((prev) => !prev)}>{isCalling ? 'Hang up' : 'Call'}</button>{' '}
          <button disabled={!isConnected} onClick={() => setMicOn((prev) => !prev)}>
            {isMicOn ? 'Mute' : 'Un-mute'}
          </button>{' '}
          <button disabled={!isConnected} onClick={() => setCameraOn((prev) => !prev)}>
            {isCameraOn ? 'Stop Video' : 'Start Video'}
          </button>
        </div>
      </div>
    </div>
  );
}
