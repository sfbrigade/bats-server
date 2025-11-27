import { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import {
  useConnectionState,
  useCurrentUID,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
  useRTCClient,
  LocalUser,
  RemoteUser,
} from 'agora-rtc-react';

import ApiService from '../ApiService';

export default function CallInterface({ channel }) {
  const client = useRTCClient();
  const [isCalling, setCalling] = useState(false);
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
  const [isCameraOn, setCameraOn] = useState(true);
  const connectionState = useConnectionState();

  const [localVideoTrack, setLocalVideoTrack] = useState();
  const [localAudioTrack, setLocalAudioTrack] = useState();
  useEffect(() => {
    if (isConnected) {
      AgoraRTC.createMicrophoneAudioTrack()
        .then((result) => {
          console.trace('microphone track', result, result.constructor.name);
          //return client.publish(result);
          setLocalAudioTrack(result);
        })
        .catch((err) => {
          console.error(err);
        });
      console.log('creating camera track?');
      AgoraRTC.createCameraVideoTrack()
        .then((result) => {
          console.trace('camera track', result, result.constructor.name);
          //return client.publish(result);
          setLocalVideoTrack(result);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [client, isConnected]);

  // const { localMicrophoneTrack: localAudioTrack } = useLocalMicrophoneTrack(isMicOn);
  // const { localCameraTrack: localVideoTrack } = useLocalCameraTrack(isCameraOn);
  console.log('!!!', localAudioTrack?.constructor?.name, localVideoTrack?.constructor?.name);
  const publishResult = usePublish([localAudioTrack, localVideoTrack]);
  const remoteUsers = useRemoteUsers();

  return (
    <>
      <div>UID: {uid}</div>
      <div>
        Connected: {JSON.stringify(isConnected)} | {connectionState}
      </div>
      {/* <div>{JSON.stringify(publishResult)}</div> */}
      <div>
        <button onClick={() => setCalling((prev) => !prev)}>{isCalling ? 'Hang up' : 'Call'}</button>{' '}
        <button onClick={() => setMicOn((prev) => !prev)}>{isMicOn ? 'Mute' : 'Un-mute'}</button>{' '}
        <button onClick={() => setCameraOn((prev) => !prev)}>{isCameraOn ? 'Stop Video' : 'Start Video'}</button>
      </div>
      {isConnected && (
        <div style={{ width: 320, height: 200 }}>
          <LocalUser
            audioTrack={localAudioTrack}
            cameraOn={isCameraOn}
            micOn={isMicOn}
            playAudio={false}
            playVideo
            videoTrack={localVideoTrack}
          />
        </div>
      )}
      {remoteUsers?.map((ru) => (
        <div key={ru.uid} style={{ width: 640, height: 480 }}>
          <RemoteUser user={ru} playAudio playVideo />
        </div>
      ))}
    </>
  );
}
