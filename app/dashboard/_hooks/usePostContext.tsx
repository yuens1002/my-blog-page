import {
  createContext,
  useReducer,
  useContext,
  ReactNode,
} from 'react';
import {
  initialState,
  reducer,
} from '@/app/dashboard/posts/new/reducer';

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
    <PostContext value={[state, dispatch]}>{children}</PostContext>
  );
};
