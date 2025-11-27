import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { AgoraRTCProvider } from 'agora-rtc-react';

import CallInterface from './CallInterface';

export default function Call() {
  const [searchParams] = useSearchParams();
  const channel = searchParams.get('channel');
  const client = useMemo(() => AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }), []);

  return (
    <>
      <AgoraRTCProvider client={client}>
        <CallInterface channel={channel} />
      </AgoraRTCProvider>
    </>
  );
}
