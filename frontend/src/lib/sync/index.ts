export function isOnline(): boolean {
    return navigator.onLine;
}

export { replayMutations } from './syncEngine';