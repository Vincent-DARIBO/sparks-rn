// Callbacks optionnels que l'écran (ou la route) peut passer à une mutation.
export interface MutationCallbacks<TData> {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}
