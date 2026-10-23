import { useController } from './useController';

export function useHost(socket) {
  return useController(socket);
}
