import { useCallback, useEffect, useState } from 'react';
import AgoraRTM from 'agora-rtm-sdk';
import ApiService from '../ApiService';

const { RTM } = AgoraRTM;

export default function useAgoraRTM({ userId, isOnline }) {
  const [rtm, setRtm] = useState();
  const [error, setError] = useState();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let isCancelled = false;
    if (userId && isOnline) {
      const rtm = new RTM(window.env.REACT_APP_AGORA_APP_ID, userId);
      const messageListener = (event) => {
        let { message, messageType } = event;
        if (messageType === 'BINARY') {
          message = new TextDecoder('utf-8').decode(message);
        }
        message = JSON.parse(message);
        setMessages((prevCalls) => {
          let newCalls = [...prevCalls];
          let index = newCalls.findIndex((call) => call.id === message.id);
          if (index >= 0) {
            newCalls[index] = { ...newCalls[index], ...message };
          } else {
            newCalls.unshift(message);
          }
          console.log('!!! messages=', newCalls);
          return newCalls;
        });
      };
      const presenceListener = (event) => {
        console.log('presence', event);
      };
      const statusListener = (event) => {
        console.log('status', event);
      };
      rtm.addEventListener('message', messageListener);
      rtm.addEventListener('presence', presenceListener);
      rtm.addEventListener('status', statusListener);
      console.log('!!! logging in with userId=', userId);
      ApiService.agora
        .getRtmToken(userId)
        .then((response) => {
          if (isCancelled) {
            throw new Error('unmounted');
          }
          const { token } = response.data;
          return rtm.login({ token });
        })
        .then(() => {
          if (isCancelled) {
            throw new Error('unmounted');
          }
          setRtm(rtm);
          setLoggedIn(true);
        })
        .catch((error) => {
          console.error(error);
          setError(error);
        });
      return () => {
        isCancelled = true;
        rtm.logout().finally(() => {
          rtm.removeEventListener('message', messageListener);
          rtm.removeEventListener('presence', presenceListener);
          rtm.removeEventListener('status', statusListener);
          setRtm();
          setLoggedIn(false);
        });
      };
    }
  }, [userId, isOnline]);

  const publish = useCallback(
    async (channelName, message) => {
      try {
        if (rtm) {
          const result = await rtm?.publish(channelName, JSON.stringify(message), { channelType: 'USER' });
          console.log('publish result=', result);
        } else {
          throw new Error('not online');
        }
      } catch (error) {
        console.error('publish error=', error);
        setError(error);
      }
    },
    [rtm]
  );

  return { isLoggedIn, messages, setMessages, error, publish };
}
