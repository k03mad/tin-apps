const env = {
    server: {
        port: process.env.npm_config_port || 13_000,
    },
    debug: process.env.DEBUG,
};

export default env;
