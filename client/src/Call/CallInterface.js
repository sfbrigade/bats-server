import { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { useJoin, usePublish, useRemoteUsers, useRTCClient, LocalUser, RemoteUser } from 'agora-rtc-react';

import { CallStatus } from 'shared/constants';

import Alert from '../Components/Alert';
import ApiService from '../ApiService';
import MicrophoneButton from './MicrophoneButton';
import CameraButton from './CameraButton';
import Ringdown from '../Models/Ringdown';
import RingdownDetails from '../Components/RingdownDetails';
import Spinner from '../Components/Spinner';

import './CallInterface.scss';
import EndCallButton from './EndCallButton';

export default function CallInterface({ call, setCall }) {
  const channel = call?.userId;
  const client = useRTCClient();
  const { isConnected } = useJoin(async () => {
    const response = await ApiService.agora.getRtcToken(channel);
    const { token } = response.data;
    return {
      appid: window.env.REACT_APP_AGORA_APP_ID,
      channel,
      token,
    };
  }, !!channel);

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
      setActiveUser((prevActiveUser) => {
        if (!prevActiveUser && call?.status === CallStatus.RINGING) {
          setCall({ ...call, status: CallStatus.ANSWERED, answeredAt: new Date().toISOString() });
        }
        return remoteUsers[0];
      });
    } else {
      setActiveUser((prevActiveUser) => {
        if (prevActiveUser) {
          setEnded(true);
        }
      });
    }
  }, [remoteUsers, call, setCall]);

  const [isShowingConfirmEnd, setShowingConfirmEnd] = useState(false);
  const [isEnded, setEnded] = useState(false);

  return (
    <div className="grid-row call-interface">
      <div className="tablet:grid-col-9">
        <div className="call-interface-content">
          <div className="call-interface-content__video">
            {activeUser && <RemoteUser user={activeUser} videoPlayerConfig={{ fit: 'contain' }} cover="/img/user.png" />}
            {isConnected && (
              <div className="call-interface-content__local-user">
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
          {(!isConnected || !CallStatus.is(call?.status, CallStatus.ANSWERED)) && (
            <div className="call-interface-content__status">
              <Spinner />
              {!isConnected && 'Connecting...'}
              {isConnected && call?.status === CallStatus.RINGING && 'Ringing...'}
            </div>
          )}
          <div className="call-interface-content__controls">
            <MicrophoneButton disabled={!isConnected} isMicOn={isMicOn} onClick={() => setMicOn((prev) => !prev)} />
            <CameraButton disabled={!isConnected} isCameraOn={isCameraOn} onClick={() => setCameraOn((prev) => !prev)} />
            <EndCallButton disabled={!isConnected} onClick={() => setShowingConfirmEnd(true)} />
          </div>
        </div>
      </div>
      <div className="tablet:grid-col-3 call-interface-sidebar">
        <div className="usa-accordion">
          <div className="usa-accordion__content">
            <div>Remote video: {JSON.stringify(activeUser?.hasVideo)}</div>
            <RingdownDetails ringdown={new Ringdown(call.ringdown)} />
          </div>
        </div>
      </div>
      {call?.status === CallStatus.DECLINED && (
        <Alert
          type="error"
          title="Call Declined"
          cancel="No"
          primary="Yes"
          onCancel={() => window.close()}
          onPrimary={() => window.location.reload()}
        >
          The call was declined on the receiving end. Ring again?
        </Alert>
      )}
      {isShowingConfirmEnd && (
        <Alert
          type="info"
          title="End Call?"
          cancel="No"
          primary="Yes"
          onCancel={() => setShowingConfirmEnd(false)}
          onPrimary={() => window.close()}
        >
          Are you sure you want to end the call?
        </Alert>
      )}
      {isEnded && (
        <Alert type="info" title="Call Ended" primary="OK" onPrimary={() => window.close()}>
          The call was ended by the other side.
        </Alert>
      )}
    </div>
  );
}
