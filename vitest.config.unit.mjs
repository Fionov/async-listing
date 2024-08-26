import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from "svelte-preprocess";

export default defineConfig({
    plugins: [
        svelte({
            hot: !process.env.VITEST,
            preprocess: sveltePreprocess({ typescript: true }),
        }),
    ],
    test: {
        environment: 'node',
        include: ['src/tests/unit/**/*.test.ts'],
    }
})