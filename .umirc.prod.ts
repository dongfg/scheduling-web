import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    'process.env.AUTH_DOMAIN': 'dongfg.auth0.com',
    'process.env.AUTH_CLIENT_ID': 'BqJ86mx1FbobtqjmuPlYg5TOnnd4nQeD',
    'process.env.AUTH_REDIRECT_URI': 'https://task.fun.dongfg.com/#/callback',
    'process.env.AUTH_AUDIENCE': 'https://api.dongfg.com/scheduling',
    'process.env.API_HOST': 'https://api.dongfg.com/scheduling',
  },
});
