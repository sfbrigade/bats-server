import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { AgoraRTCProvider } from 'agora-rtc-react';
import { v4 as uuid } from 'uuid';

import CallInterface from './CallInterface';

const callId = uuid();

export default function Call() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const ringdownId = searchParams.get('ringdownId');
  const [call, setCall] = useState({});

  useEffect(() => {
    let channel = new BroadcastChannel('callCoordination');
    channel.onmessage = (event) => {
      setCall((call) => {
        if (event.data.id === call.id || event.data.id === id || event.data.ringdown?.id === ringdownId) {
          return { ...call, ...event.data };
        }
        return call;
      });
    };
    if (id) {
      channel.postMessage({
        id,
        status: 'answered',
        answeredAt: new Date().toISOString(),
      });
    } else if (ringdownId) {
      channel.postMessage({
        callId,
        ringdownId,
      });
    }
    return () => channel.close();
  }, [id, ringdownId]);

  const client = useMemo(() => AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }), []);

  return (
    <>
      <AgoraRTCProvider client={client}>{call && <CallInterface call={call} setCall={setCall} />}</AgoraRTCProvider>
    </>
  );
}
