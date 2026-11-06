import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL || 'https://easy-magpie-192739.upstash.io';
const token = process.env.UPSTASH_REDIS_REST_TOKEN || 'gQAAAAAAAvDjAAIgcDIwYjI3OGQ0NjIxYjk0M2ExODgxZWM5MDA0YjYzNmUyNw';

export const redis = new Redis({
  url,
  token,
});
