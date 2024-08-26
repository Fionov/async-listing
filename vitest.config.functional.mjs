import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import {svelteTesting} from '@testing-library/svelte/vite'
import sveltePreprocess from "svelte-preprocess";
import {resolve} from "path";

export default defineConfig({
    plugins: [
        svelte({
            hot: !process.env.VITEST,
            preprocess: sveltePreprocess({ typescript: true }),
        }),
        svelteTesting(),
    ],
    resolve: {
        alias: {
            src: resolve(__dirname, 'src'), // настройка алиаса для src/
        },
    },
    test: {
        environment: 'jsdom',
        include: ['src/tests/functional/**/*.test.ts'],
        setupFiles: ['./vitest-setup.js'],
    }
})