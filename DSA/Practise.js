class Mutex {
    constructor() {
        this.locked = false
        this.queue = []
    }
    async lock() {
        return new Promise((resolve) => {
            const unlock = () => {
                this.locked = false
                if (this.queue.length > 0) {
                    const nextUnlock = this.queue.shift();
                    nextUnlock()
                }
            }

            if (!this.locked) {
                this.locked = true
                resolve(unlock)
            } else {
                this.queue.push(() => {
                    this.locked = true
                    resolve(unlock)
                })
            }
        })
    }
}
class Seatlock {
    constructor(seat, show, timeout, lockedBy, lockedTime) {
        this.seat = seat
        this.show = show
        this.timeout = timeout
        this.lockedBy = lockedBy
        this.lockedTime = lockedTime || new Date()
    }

    isExpired() {
        const expiredTime = new Date(this.lockedTime.getTime() + this.timeout * 1000);
        return new Date() > expiredTime;
    }
}

class SeatLockProvider {
    constructor(seatlockprovider) {
        this.seatlockprovider = seatlockprovider
        this.locks = new Map()
        this.mutexes = new Map()
    }
    getMutex(showId) {
        if (!this.mutexes.get(showId)) {
            this.mutexes.set(showId, new Mutex())
        }
    }
    getShowLocks(showId) {
        if (!this.locks.get(showId)) {
            this.locks.set(showId, new Map())
        }
        return this.locks.get(showId)
    }
    isSeatLocked(showId, seat) {
        const showlocks = this.getShowLocks(showId);
        const lock = showlocks.get(seat);
        if (lock && lock.isExpired()) {
            showlocks.delete(seat)
            return false
        }
        return true
    }
    getLockedSeats(showId) {
        const showlocks = this.getShowLocks(showId)
        let locked = []
        for (let [seat, lock] of showlocks) {
            if (!lock.isExpired()) {
                locked.push(seat)
            } else {
                showlocks.delete(seat)
            }
        }
        return locked
    }
    async lockSeats(showId, seats, user) {
        const unlock = this.mutexes.get(showId).lock()
        try {
            const showlocks = this.getShowLocks(showId)
            for (const seat of seats) {
                if (this.isSeatLocked(seat)) {
                    throw new Error("seat locked")
                } else {
                    const seatlock = new Seatlock(seat, user, showId, this.timeout)
                    showlocks.set(seat, lock)
                }
            }
        } finally {
            unlock()
        }
    }
    async unlockSeats(showId, seats, user) {
        const unlock = this.mutexes.get(showId).lock()
        try {
            const showlocks = this.getShowLocks(showId)
            for (const seat of seats) {
                const lock = showlocks.get(seat)
                if (lock && lock.lockedBy === user && !lock.isExpired()) {
                    showlocks.delete(seat)
                }
            }
        } finally {
            unlock()
        }
    }
    async validateLocks(showId, seats, user) {
        const unlock = this.mutexes.get(showId).lock()
        try {
            const showlocks = this.getShowLocks(showId)
            for (const seat of seats) {
                const lock = showlocks.get(seat)
                if (!lock || lock.lockedBy !== user || lock.isExpired()) {
                    if (lock && lock.isExpired()) {
                        showlocks.delete(seat)
                    }
                }
            }
            return true
        } finally {
            unlock()
        }
    }
}
class BookingService{
    constructor(seatlockprovider){
        this.seatlockprovider = seatlockprovider
        this.bookings = new Map()
        this.counter = 0
    }
    async getBookedSeats(showId){
        return this.bookings.get(showId) || 0
    }
    async createBooking(seats, showId, user){
        await this.seatlockprovider.lockSeats(showId, seats, user)
        const valid = this.seatlockprovider.validateLocks(showId, seats, user)
        if(!valid){
            //
            this.seatlockprovider.unlockSeats(showId, seats, user)
        }
        if(!this.bookings.get(showId)){
            this.bookings.set(showId, new Set())
        }
        for(const seat of seats){
            this.bookings.get(showId).add(seat)
        }
        await this.seatlockprovider.unlockSeats(showId, seats, user)
        return this.counter++
    }
}
const lock = new SeatLockProvider(2)
const bs = new BookingService(lock)