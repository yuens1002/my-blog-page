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
const NewPostContext = createContext<
  [typeof initialState, React.Dispatch<any>]
>([initialState, () => null]);

// Custom hook to use the NewPostContext
export const useNewPostContext = () => useContext(NewPostContext);

// Provider component
export const NewPostProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <NewPostContext value={[state, dispatch]}>
      {children}
    </NewPostContext>
  );
};
