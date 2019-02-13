module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: 'mapleChain.server',
      script: './bin/run',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: 'mapleChain',
      ref: 'origin/master',
      'post-deploy': 'git pull && npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
}
