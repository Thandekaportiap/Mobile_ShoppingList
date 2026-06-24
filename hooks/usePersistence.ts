import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { loadLists } from '../store/slices/listsSlice';
import { setUserName } from '../store/slices/userSlice';

const STORAGE_KEY = 'shoplist_data';
const USER_KEY = 'shoplist_user';

export const usePersistence = () => {
  const dispatch = useAppDispatch();
  const lists = useAppSelector(state => state.lists);
  const userName = useAppSelector(state => state.user.name);

  // Load on app start
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) dispatch(loadLists(JSON.parse(saved)));

        const savedUser = await AsyncStorage.getItem(USER_KEY);
        if (savedUser) dispatch(setUserName(savedUser));
      } catch (e) {
        console.error('Failed to load data', e);
      }
    };
    load();
  }, []);

  // Save lists on every change
  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
      } catch (e) {
        console.error('Failed to save data', e);
      }
    };
    save();
  }, [lists]);

  // Save username when it changes
  useEffect(() => {
    const saveUser = async () => {
      if (userName) {
        await AsyncStorage.setItem(USER_KEY, userName);
      }
    };
    saveUser();
  }, [userName]);
};