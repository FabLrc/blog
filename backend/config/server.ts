export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  // Configure cookies to allow insecure connections (for HTTP on NAS)
  cookie: {
    secure: false, // Allow cookies over HTTP (not HTTPS)
    httpOnly: true,
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
  },
});
