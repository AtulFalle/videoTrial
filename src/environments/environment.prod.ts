export const environment = {
  production: true,
  SERVER_URI: 'http://localhost:3000',
  SUBTITLE_TIME: 3,
  CHUNK_SIZE:  1 * 1024 * 1024, // 1 MB = 1024 * 1024
  refreshCheckInterval: 120, // time interval in seconds when token will be refreshed before expiry time
};
