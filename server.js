const app = require('./app');
const config = require('./config/config');
const logger = require('./utils/logger');

const PORT = config.PORT;

app.listen(PORT, () => {
  logger.info(`Notification service running on port ${PORT}`);
});