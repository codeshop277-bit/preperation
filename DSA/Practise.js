const VehicleType = {
    ECONOMY: 'ECONOMY',
    SUV: 'SUV',
    SEDAN: 'SEDAN',
    BIKE: 'BIKE'
};

const ReservationStatus = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    CONFIRMED: 'CONFIRMED'
};

class Vehicle {
    constructor(regNo, model, make, year, price) {
        this.regNo = regNo
        this.model = model
        this.make = make
        this.year = year
        this.price = price
        this.isAvailable = true
    }
    getType() {
        throw ('new')
    }
};
class EconomyVehicle extends Vehicle {
    getType() {
        return VehicleType.ECONOMY
    }
}
class VehicleFactory {
    static createVehicle(type, ...args) {
        switch (type) {
            case VehicleType.ECONOMY:
                return new EconomyVehicle(...args);
            default:
                return 'Unknown vehicle type'
        }
    }
};

class PaymentStrategy {
    processPayment() {
        throw ('new')
    }
}
class UPIPayment extends PaymentStrategy {
    processPayment(amount) {
        return true
    }
};

class PricingStartegy {
    calculateCost() {
        throw ('new')
    }
}
class DailyPricing extends PricingStartegy {
    calculateCost(basePrice, hours) {
        return basePrice * (Math.ceil(hours / 24) * 24)
    }
}
class Location {
    constructor(area, zipcode) {
        this.area = area
        this.zipcode = zipcode
    }
}
class Reservation {
    constructor(startDate, endDate, pickup, drop, pricigStrategy, id, user, vehicle) {
        this.id = id
        this.user = user
        this.startDate = startDate
        this.endDate = endDate
        this.vehicle = vehicle
        this.strategy = pricigStrategy
        this.pickup = pickup
        this.drop = drop
        this.status = ReservationStatus.PENDING
    }
    confirm() {
        this.status = ReservationStatus.CONFIRMED
        this.vehicle.isAvailable = false
    }
    cancel() {
        this.status = ReservationStatus.CANCELLED
        this.vehicle.isAvailable = true
    }
    calculateCost() {
        const duration = (this.endDate - this.startDate) / (1000 * 60 * 60);
        this.strategy = this.strategy.calculateCost(this.vehicle.price, duration)
    }
}
class User {
    constructor(name, email) {
        this.id = this.id
        this.name = name
        this.email = email
        this.reservations = []
    }

    addReservation(reservation) {
        this.reservations.push(reservation)
    }
}

class RentalSystem {
    static instance = null
    constructor() {
        if (RentalSystem.instance) {
            return RentalSystem.instance
        }
        this.stores = []
        this.users = []
        this.reservations = []
        this.payment = new PaymentProcessor()
    }
    static getInstance() {
        if (!RentalSystem.instance) {
            RentalSystem.instance = new RentalSystem()
        }
        return RentalSystem.instance
    }

    addStores(store) {
        this.stores.push(store)
    }
    createReservation(userId, vehicleNo, pickupId, startDate, endDate, pricigStrategy, PaymentStrategy) {
        const user = this.users.find((u) => u.id == userId);
        const store = this.users.find((u) => u.id == pickupId);
        const vehicle = store.vehicles.find((u) => u.regNo == vehicleNo);
        if(!vehicle || !vehicle.isAvailable){
            return 'Vehicle not available';
        }
        const reservation = new Reservation(id, vehicle, user, startDate, endDate, pricigStrategy, PaymentStrategy)
        const cost = reservation.calculateCost()
        if(this.payment.processPayment(cost, PaymentStrategy)){
            this.reservations.push(reservation)
            user.addReservation(reservation)
            reservation.confirm()
            return reservation
        }
    }
}