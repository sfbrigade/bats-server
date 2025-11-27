import { useSearchParams } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { AgoraRTCProvider } from 'agora-rtc-react';

import CallInterface from './CallInterface';

export default function Call() {
  const [searchParams] = useSearchParams();
  const channel = searchParams.get('channel');

  return (
    <>
      <h1>Call {channel}</h1>
      <AgoraRTCProvider client={AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })}>
        <CallInterface channel={channel} />
      </AgoraRTCProvider>
    </>
  );
}
