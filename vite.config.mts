import {defineConfig} from "vite";
import react from '@vitejs/plugin-react'

export default ({mode}) => {
    return defineConfig({
        plugins: [
            react(),
        ],
        base: './',
        build: {
            target: 'esnext',
        },
    });
};