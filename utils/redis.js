import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    // Log any error that occurs in the Redis client
    this.client.on('error', (err) => console.error('Redis Client Error:', err));

    // Promisify the client methods for async/await usage
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    try {
      const value = await this.getAsync(key);
      return value;
    } catch (err) {
      console.error('Error getting value from Redis:', err);
      return null;
    }
  }

  async set(key, value, duration) {
    try {
      await this.setAsync(key, value, 'EX', duration);
    } catch (err) {
      console.error('Error setting value in Redis:', err);
    }
  }

  async del(key) {
    try {
      await this.delAsync(key);
    } catch (err) {
      console.error('Error deleting key from Redis:', err);
    }
  }
}

// Export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
