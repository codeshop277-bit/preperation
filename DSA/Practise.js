const Direction = {
    UP: 'UP',
    DOWN: 'DOWN',
    IDLE: 'IDLE'
}

const State = {
    IDLE: 'IDLE',
    MOVING: 'MOVING',
    DOORS_OPEN: 'DOORS_OPEN'
}

class ElevatorRequest{
    constructor(type, floor, direction = null){
       this.type = type
       this.direction = direction
       this. floor = floor
    }

    execute(){
        //this.requests.push(request)
    }
}

class Observer{
    update(elevator){
        //
    }
}

class Elevator{
    constructor(id, startingFloor = 0){
        this.id = id
        this.currentFloor = startingFloor
        this.direction = Direction.IDLE
        this.state = State.IDLE
        this.requests = []
        this.observers = []
    }
    addObserver(observer){
        this.observers.push(observer)
    }
    notifyObserver(observer){
        this.observers.forEach((obs) => obs.update(this))
    }
    addRequest(request){
        this.requests.push(request)
        this.updateDirection();
        this.notifyObserver();
    }
    updateDirection(){
        if(this.requests.length == 0){
            this.direction = Direction.IDLE
            this.state = State.IDLE
            return
        }
        const firstRequest = this.requests[0];
        if(firstRequest > this.currentFloor){
            this.direction = Direction.UP
        }else{
            this.direction = Direction.DOWN
        }
        this.state = State.MOVING
    }
    getNextStop(){
        if(this.requests.length === 0) return null;
        let candidates = []
        this.requests.forEach((req) => {
            const dist = Math.abs(req.floor - this.currentFloor);
            const isSameDirection = req.direction == this.direction;
            const sameDir = (this.direction == Direction.UP && req.floor > this.currentFloor) ||
            (this.direction == Direction.DOWN && req.floor < this.currentFloor)
            if(isSameDirection && sameDir){
                candidates.push({floor: req.floor, dist})
            }
        })
        if(candidates.length == 0){
            this. direction = this.direction == Direction.UP ? Direction.DOWN : Direction.UP
            return this.getNextStop()
        }
        candidates.sort((a,b) => a.dist - b.dist)
        return candidates[0].floor
    }

    processRequest(){
        this.state = State.DOORS_OPEN
        this.requests.forEach((req) => {
            if(req.floor == this.currentFloor){
                return false
            }
            return true
        })
        this.state = State.MOVING
    }
    move(){
        const nextStop = this.getNextStop()
        if(nextStop == null) return

        while(this.currentFloor != nextStop){
            this.currentFloor += this.direction == Direction.UP ? 1 : -1;
            this.processRequest()
        }
        this.processRequest();
        this.updateDirection();
        this.notifyObserver();
    }
}
class Building{
    constructor(floors, elevator = 1){
        this.floors = floors
        this.elevators = []
        for(let i =1; elevator.length ; i++){
            this.elevators.push(new Elevator(i))
        }
        this.controller = new ElevatorController(this.elevators)
    }
}

class ElevatorController{
    constructor(elevator){
        this.elevators = elevator
    };

    assignRequest(){
        const elevator = this.elevators[0];
        elevator.addRequest(elevator);
        return elevator
    }
}