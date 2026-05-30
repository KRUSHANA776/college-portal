module.exports = {
  apps: [
    {
      name: 'college-backend',
      script: './server.js',
      instances: 'max', // Utilize all CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      }
    }
  ]
};
