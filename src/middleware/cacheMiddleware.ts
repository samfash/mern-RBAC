import Redis from "ioredis";
const redis = new Redis();

// Cache middleware
export const cache = (req: any, res: any, next: any) => {
  const key = req.originalUrl;
  redis.get(key, (err, data) => {
    if (err) return next();
    if (data) return res.status(200).json(JSON.parse(data));
    next();
  });
};