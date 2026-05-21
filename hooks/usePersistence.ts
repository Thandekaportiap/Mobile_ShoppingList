import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { loadLists } from '../store/slices/listsSlice';

const STORAGE_KEY = 'shoplist_data';

export const usePersistence = () => {
  const dispatch = useAppDispatch();
  const lists = useAppSelector(state => state.lists);

  // Load on app start
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) dispatch(loadLists(JSON.parse(saved)));
      } catch (e) {
        console.error('Failed to load data', e);
      }
    };
    load();
  }, []);

  // Save on every change
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
};