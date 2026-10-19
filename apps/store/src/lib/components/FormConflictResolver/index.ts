import { useFormConflictResolver } from './context';
import { FormConflictResolverProvider } from './FormConflictResolverProvider';
import { ReviewButton } from './ReviewButton';

export const FormConflictResolver = {
  Provider: FormConflictResolverProvider,
  ReviewButton,
  useContext: useFormConflictResolver,
};

export type {
  FormConflictPolicy,
  FormConflictResolverProviderProps,
  FormRefreshAdapter,
} from './types';
