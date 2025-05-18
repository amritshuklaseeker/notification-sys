const config = require('../config/config');
const logger = require('./logger');

async function retry(fn, description = '', attempt = 1) {
  try {
    return await fn();
  } catch (error) {
    if (attempt >= config.MAX_RETRIES) {
      logger.error(`Max retries reached for ${description}`);
      throw error;
    }

    const delay = config.RETRY_DELAY * attempt;
    logger.warn(`Retry ${attempt} for ${description} after ${delay}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retry(fn, description, attempt + 1);
  }
}

module.exports = { retry };