//client\src\hooks\useMutationHook.ts
import { QueryKey, useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { createEntity, editEntity } from "@/api/apiCall";
import useToastHook from "./useToastHook";

interface MutationEntityStateActions<TData> {
  URL: string;
  queryKey: QueryKey;
  successToast: string;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccessCallback?: (data: TData) => void;
}

export const useMutationHook = () => {
  const { fireSuccessToast, fireErrorToast } = useToastHook();

  const client = useQueryClient();

  const useCreateNewEntity = <TData>({ URL, queryKey, successToast, setIsOpen }: MutationEntityStateActions<TData>): UseMutationResult<void, Error, TData, unknown> => {
    return useMutation({
      mutationFn: (entityData: TData) => createEntity<TData>(URL, entityData),
      onSuccess: () => {
        client.invalidateQueries({
          queryKey: queryKey
        });
        fireSuccessToast(successToast);
        setIsOpen && setIsOpen(false);
      },
      onError: (error: any) => {
        fireErrorToast(error.message || "Something went wrong. Please try again.");
      }
    });
  };

  const useEditEntity = <TData>({ URL, queryKey, successToast, setIsOpen, onSuccessCallback }: MutationEntityStateActions<TData>): UseMutationResult<void, Error, TData, unknown> => {
    return useMutation({
      mutationFn: (entityData: TData) => editEntity<TData>(URL, entityData),
      onSuccess: (data: any) => {
        client.invalidateQueries({
          queryKey
        });
        fireSuccessToast(successToast);
        setIsOpen && setIsOpen(false);
        onSuccessCallback && onSuccessCallback(data);
      },
      onError: (error: any) => {
        fireErrorToast(error.message || "Something went wrong. Please try again.");
      }
    });
  };

  return {
    useCreateNewEntity,
    useEditEntity
  };
};
