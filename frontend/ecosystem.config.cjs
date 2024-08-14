module.exports = {
    apps: [
        {
            name: 'vite-app',
            script: 'npm',
            args: 'run start',
            watch: false,
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'development'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ]
};