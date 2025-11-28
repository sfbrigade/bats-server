import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { AgoraRTCProvider } from 'agora-rtc-react';

import CallInterface from './CallInterface';

export default function Call() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [call, setCall] = useState();

  useEffect(() => {
    let channel = new BroadcastChannel('callCoordination');
    channel.onmessage = (event) => {
      if (event.data.id === id) {
        setCall(event.data);
      }
    };
    channel.postMessage({
      id,
      status: 'answered',
    });
    return () => channel.close();
  }, [id]);

  const client = useMemo(() => AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }), []);

  return (
    <>
      <AgoraRTCProvider client={client}>{call && <CallInterface call={call} />}</AgoraRTCProvider>
    </>
  );
}
