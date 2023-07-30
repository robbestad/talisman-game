module.exports = {
  apps: [
    {
      name: "talismangame",
      script: "./server.js",
      watch: "./server.js",
      watch: false,
      ignore_watch: ["downloads","temp"],
      node_args: ["--max_old_space_size=4096"],
      env_production: {
        DEBUG: "app",
        NODE_ENV: "production",
      },
      env_development: {
        DEBUG: "app",
        NODE_ENV: "development",
      },
    },
  ],
};
