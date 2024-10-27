'use client';

import {
  createContext,
  useReducer,
  useContext,
  type ReactNode,
} from 'react';
import {
  initialState,
  reducer,
} from '@/app/dashboard/posts/_reducer/reducer';

// Create a context that holds both state and dispatch
const PostContext = createContext<
  [typeof initialState, React.Dispatch<any>]
>([initialState, () => null]);

// Custom hook to use the NewPostContext
export const usePostContext = () => useContext(PostContext);

// Provider component
export const PostProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <PostContext.Provider value={[state, dispatch]}>
      {children}
    </PostContext.Provider>
  );
};
