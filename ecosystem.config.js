module.exports = {
  apps: [{
    name: "nodejs-approfondissement",
    script: "server.js",
    exec_mode: "cluster",
    instances: 3,                 
    max_memory_restart: "200M",   
    error_file: "./logs/err.log", 
    out_file: "./logs/out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    env: { NODE_ENV: "production", PORT: 3000 }
  }]
};
