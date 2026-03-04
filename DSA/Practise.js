const Tier = {
    FREE: 'FREE',
    PREMIUM: 'PREMIUM'
}
const RateLimiterType = {
    TOKEN_BUCKET: 'TOKEN_BUCKET'
}
class User {
    constructor(userid, tier) {
        this.userid = userid
        this.tier = tier
    }
}
class RateLimiter {
    constructor() {
        this.userstates = new Map()
        this.config = config
    }
    allowRequest() {
        //needs to be implemented
    }
}
class TokenBucketRateLimiter extends RateLimiter {
    allowRequest(userId) {
        const now = new Date.now()
        const state = this.userstates.get(userId)
        if (!state) {
            this.userstates.set(userId, { tokens: this.config.capacity, lastRefill: now })
        }
        const elapsed = now - state.lastRefill
        const tokensToAdd = Math.floor(elapsed / this.config.windowMS) * this.config.refillRate
        if (tokensToAdd > 0) {
            state.tokens = Math.min(tokensToAdd + state.tokens, this.config.capacity)
            state.lastRefill = now
        }
        if (state.tokens >= 1) {
            state.token--
            return true
        }
        return false
    }
}
class RateLimiterFactory {
    static create(type, args) {
        switch (type) {
            case RateLimiterType.TOKEN_BUCKET:
                return new TokenBucketRateLimiter(args)
            default:
                return "mustbe implemented"
        }
    }
}
class RateLimiterService {
    constructor() {
        this.limiters = new Map()
        this.limiters.set(UserTier.FREE, RateLimiterFactory.create(RateLimitType.TOKEN_BUCKET, {
            capacity: 2, // Max burst
            refillRate: 1, // Tokens per window
            windowMs: 10000 // 10 seconds
        }));
    }
    allowRequest(user){
        const limiter = this.limiters.get(user.tier)
        return limiter.allowRequest(user.userid)
    }
}
const service = new RateLimiterService();
const freeUser = new User('user123', UserTier.FREE);
const premiumUser = new User('user456', UserTier.PREMIUM);

console.log(service.allowRequest(freeUser)); // true
console.log(service.allowRequest(freeUser)); // true
console.log(service.allowRequest(freeUser));