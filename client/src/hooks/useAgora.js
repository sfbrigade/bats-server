import { useCallback, useEffect, useState } from 'react';
import AgoraRTM from 'agora-rtm-sdk';
import ApiService from '../ApiService';

const { RTM } = AgoraRTM;

export default function useAgora({ userId }) {
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
          console.log(event);
        };
        const presenceListener = (event) => {
          console.log(event);
        };
        const statusListener = (event) => {
          console.log(event);
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
      const { token } = await ApiService.get(`/api/agora/token?channelName=${userId}`);
      const result = await rtm.login({ token });
      console.log(result);
      setLoggedIn(true);
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }, [rtm, userId]);
  return { isInitialized, isLoggedIn, login, error };
}
