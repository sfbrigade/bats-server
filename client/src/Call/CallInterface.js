import { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { useJoin, usePublish, useRemoteUsers, useRTCClient, LocalUser, RemoteUser } from 'agora-rtc-react';

import ApiService from '../ApiService';
import MicrophoneButton from './MicrophoneButton';
import CameraButton from './CameraButton';
import Ringdown from '../Models/Ringdown';
import RingdownDetails from '../Components/RingdownDetails';

import './CallInterface.scss';
import EndCallButton from './EndCallButton';

export default function CallInterface({ call }) {
  const channel = call?.userId;
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
  }, channel && isCalling);

  const [isMicOn, setMicOn] = useState(true);
  const [isCameraOn, setCameraOn] = useState(false);

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
        <div className="call-interface-content">
          <div className="call-interface-content__video">
            {activeUser && (
              <RemoteUser user={activeUser} playAudio playVideo videoPlayerConfig={{ fit: 'contain' }} cover="/img/user.png" />
            )}
            {isConnected && (
              <div className="local-user">
                <LocalUser
                  audioTrack={localMicrophoneTrack}
                  cameraOn={isCameraOn}
                  cover="/img/user.png"
                  micOn={isMicOn}
                  playAudio={false}
                  playVideo={isCameraOn}
                  videoTrack={localCameraTrack}
                />
              </div>
            )}
          </div>
          <div className="call-interface-content__controls">
            <MicrophoneButton disabled={!isConnected} isMicOn={isMicOn} onClick={() => setMicOn((prev) => !prev)} />
            <CameraButton disabled={!isConnected} isVideoOn={isCameraOn} onClick={() => setCameraOn((prev) => !prev)} />
            <EndCallButton disabled={!isConnected} onClick={() => setCalling(false)} />
          </div>
        </div>
      </div>
      <div className="tablet:grid-col-3">
        <div className="usa-accordion consult">
          <div className="usa-accordion__content">
            <RingdownDetails ringdown={new Ringdown(call.ringdown)} />
          </div>
        </div>
      </div>
    </div>
  );
}
