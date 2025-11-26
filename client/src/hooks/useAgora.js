import { useCallback, useEffect, useState } from 'react';
import AgoraRTM from 'agora-rtm-sdk';
import ApiService from '../ApiService';

const { RTM } = AgoraRTM;

export default function useAgora({ userId, channelName }) {
  const [rtm, setRtm] = useState();
  const [error, setError] = useState();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setIsInitialized(false);
    if (userId) {
      try {
        const rtm = new RTM(window.env.REACT_APP_AGORA_APP_ID, userId);
        const messageListener = (event) => {
          console.log('message', event);
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
      const response = await ApiService.agora.getToken(userId, channelName);
      const { token } = response.data;
      const result = await rtm.login({ token });
      console.log('login result=', result);
      setLoggedIn(true);
    } catch (error) {
      console.error('login error=', error);
      setError(error);
    }
  }, [rtm, userId, channelName]);

  return { isInitialized, isLoggedIn, login, error };
}
