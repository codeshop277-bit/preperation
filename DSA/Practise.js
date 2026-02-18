const vehicleTypeEnum = {
    CAR: "CAR",
    BIKE: "BIKE"
}
class ParkingFeeStrategy{
    calculateFee(duration){
        throw new Error("must ")
    }
}
class BasicHourlyRate extends ParkingFeeStrategy{
    constructor(rate = 5){
        super();
        this.rate = rate;
    }
    calculateFee(duration){
        return this.rate * duration
    }
}
class PremiumHourlyRate extends ParkingFeeStrategy{
    constructor(rate = 10){
        super();
        this.rate = rate;
    }
    calculateFee(duration){
        return this.rate * duration
    }
}

class PaymentStrategy{
    processPayment(amount){
        throw new Error("must")
    }
}
class CreditCardPayment extends PaymentStrategy{
    processPayment(amount){
        console.log(`processed amount ${amount}`)
        return true;
    }
}
class Vehicle{
    constructor(licensePlate, feeStartegy){
        this.licensePlate = licensePlate;
        this.feeStartegy = feeStartegy;
        this.vehicleType = null;
        this.entryTime = null
    }
    getType(){
        return this.vehicleType;
    }
}
class Bike extends Vehicle{
    constructor(licensePlate, feeStartegy){
        super(licensePlate, feeStartegy);
        this.vehicleType = vehicleTypeEnum.BIKE;
    }
}
class VehicleFactory{
    static createVehicle(licensePlate, type, feeStartegy){
        switch(type){
            case vehicleTypeEnum.BIKE:
                return new Bike(licensePlate, feeStartegy)
            default:
                throw new Error('unknown')
        }
    }
}

class ParkingSpot{
    constructor(spotNo){
        this.spotNo = spotNo;
        this.occupied = false;
        this.vehicle = null;
    }
    canPark(vehicle){

    }
    vacate(){
        this.occupied = false
        this.vehicle = null
    }
    parkVehicle(vehicle){
        if(this.occupied){
            return 'cant'
        }
        this.occupied = true
        this.vehicle = vehicle
        vehicle.entryTime = new Date()
    }
    getVehicle(){
        return this.vehicle
    }
}
class BikeParkingSpot extends ParkingFeeStrategy{
    canPark(vehicle){
        return vehicle.getType() == vehicleTypeEnum.BIKE
    }
}

class ParkingFloor{
    constructor(floorNo, cars=0, bike=0){
        this.floorNo = floorNo
        this.spots = [];
        for(let i=0; i<bike; i++){
            this.spots.push(new BikeParkingSpot(`${floorNo}-B${i}`))
        }
    }
    findSpot(type){
        return this.spots.find(spot => !spot.occupied && spot.canPark({getType() => type}))
    }
}
class ParkingLotBuilder{
    constructor(){
        this.floors = []
    }
    addFloor(floorNo, cars, bike){
        this.floors.push(new ParkingFloor(floorNo, cars, bike))
        return this
    }
    build(){
        return new ParkingLot(this.floors)
    }
}
class ParkingLot{
    constructor(floors){
        this.floors = floors
        this.tickets = new Map()
    }
    findAvailableSpot(type){
        for(let floor of this.floors){
            const spot = floor.findSpot(type);
            if(spot) return spot
        }
        return null
    }
    parkVehicle(vehicle){
        const spot = this.findAvailableSpot(vehicle.getType())
        if(!spot){
            return 'no spot'
        }
        spot.parkVehicle(vehicle);
        this.tickets.set(vehicle.licensePlate, {spot, entryTime: vehicle.emtryTime})
        return spot.spotNo
    }
    vacateSpot(licensePlate, paymentStrategy){
        const ticket = this.tickets.get(licensePlate);
        const now = new Date();
        const duration = (now - ticket.entryTime)/(1000*60*60);
        const fee = ticket.spot.getVehicle().feeStartegy.calculateFee(duration)
        const paid = paymentStrategy.processPayment(fee)
        ticket.spot.vacate()
        this.tickets.delete(licensePlate);
    }
}