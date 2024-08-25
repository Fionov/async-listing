import { writable } from 'svelte/store';
import type { Coffee } from 'src/lib/interfaces/Coffee';

export const coffeeList = writable<Coffee[]>([]);
export const isLoading = writable<boolean>(false);