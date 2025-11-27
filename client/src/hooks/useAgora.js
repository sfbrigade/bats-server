import { useCallback, useEffect, useState } from 'react';
import AgoraRTM from 'agora-rtm-sdk';
import ApiService from '../ApiService';

const { RTM } = AgoraRTM;

export default function useAgora({ userId, signalUserId }) {
  const [rtm, setRtm] = useState();
  const [error, setError] = useState();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    setIsInitialized(false);
    if (signalUserId) {
      try {
        const rtm = new RTM(window.env.REACT_APP_AGORA_APP_ID, signalUserId);
        const messageListener = (event) => {
          let { message, messageType } = event;
          if (messageType === 'BINARY') {
            message = new TextDecoder('utf-8').decode(message);
          }
          message = JSON.parse(message);
          setCalls((prevCalls) => {
            let newCalls = [...prevCalls];
            let index = newCalls.findIndex((call) => call.id === message.id);
            if (index >= 0) {
              newCalls[index] = { ...newCalls[index], ...message };
            } else {
              newCalls.push(message);
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
  }, [signalUserId]);

  const login = useCallback(async () => {
    try {
      const response = await ApiService.agora.getRtmToken(signalUserId);
      const { token } = response.data;
      await rtm.login({ token });
      setLoggedIn(true);
    } catch (error) {
      console.error('login error=', error);
      setError(error);
    }
  }, [rtm, signalUserId]);

  const join = useCallback(
    async (channelId) => {
      console.log(userId, 'join', channelId);
    },
    [userId]
  );

  return { isInitialized, isLoggedIn, login, calls, setCalls, join, error };
}
