import { useCallback, useEffect, useState } from 'react';
import AgoraRTM from 'agora-rtm-sdk';
import ApiService from '../ApiService';

const { RTM } = AgoraRTM;

export default function useAgoraRTM({ userId }) {
  const [rtm, setRtm] = useState();
  const [error, setError] = useState();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setIsInitialized(false);
    if (userId) {
      try {
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
        setRtm(rtm);
        setIsInitialized(true);
        return () => {
          rtm.removeEventListener('message', messageListener);
          rtm.removeEventListener('presence', presenceListener);
          rtm.removeEventListener('status', statusListener);
        };
      } catch (error) {
        console.error(error);
        setError(error);
        setRtm(null);
      }
    } else {
      setRtm(null);
    }
  }, [userId]);

  const login = useCallback(async () => {
    try {
      const response = await ApiService.agora.getRtmToken(userId);
      const { token } = response.data;
      await rtm.login({ token });
      setLoggedIn(true);
    } catch (error) {
      console.error('login error=', error);
      setError(error);
    }
  }, [rtm, userId]);

  const publish = useCallback(
    async (channelName, message) => {
      try {
        if (!isLoggedIn) {
          await login();
        }
        const result = await rtm.publish(channelName, JSON.stringify(message), { channelType: 'USER' });
        console.log('publish result=', result);
      } catch (error) {
        console.error('publish error=', error);
        setError(error);
      }
    },
    [rtm, isLoggedIn, login]
  );

  return { isInitialized, isLoggedIn, login, messages, setMessages, error, publish };
}
