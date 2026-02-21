const ProductCategory = Object.freeze({
    ELECTRONICS: 'ELECTRONICS',
    GROCERY: 'GROCERY',
    CLOTHING: 'CLOTHING'
})

class Product {
    constructot(id, name, price, threshold, quantity, category) {
        this.id = id
        this.name = name
        this.price = price
        this.threshold = threshold
        this.quantity = quantity
        this.category = category
    }
    isLowStock() {
        this.quantity <= this.threshold
    }
}
class ElectronicProduct extends Product {
    constructor(id, name, price, quantity, threshold, brand, warranty, powerConsumption) {
        super(id, name, price, quantity, threshold, ProductCategory.ELECTRONICS);
        this.brand = brand;
        this.warranty = warranty;
        this.powerConsumption = powerConsumption;
    }
}

class ElectronicProductBuilder extends ElectronicProduct {
    constructor(id, name, price, quantity, threshold) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.threshold = threshold;
        this.brand = 'Generic';
        this.warranty = 1; // Default 1 year
        this.powerConsumption = 'N/A';
    }

    build() {
        return new ElectronicProduct(
            this.id,
            this.name,
            this.price,
            this.quantity,
            this.threshold,
            this.brand,
            this.warranty,
            this.powerConsumption
        );
    }
}

class ProductFactory {
    static createProduct(type, ...args) {
        switch (type) {
            case ProductCategory.ELECTRONICS:
                return new ElectronicProductBuilder(...args)
            default:
                return "Must be implemented"
        }
    }
}

class ReplishmentStrategy {
    replishment(product, quantity) {
        product.quantity += quantity
        //
    }
}
class JustInTimeStrategy extends ReplishmentStrategy {
    replishment(product, quantity) {
        //
    }
}

class Warehouse {
    constructor(id,) {
        this.id = id,
            this.products = new Map()
    }

    addProduct(product) {
        if (this.products.get(product.id)) {
            this.products.get(product).quantity += product.quantity
        } else {
            this.products.set(product.id, product)
        }
    }
    removeProduct(product) {
        if (this.products.get(product.id)) {
            this.products.get(product).quantity -= product.quantity
            return true
        }
        return false
    }
    getProduct() {
        return this.products.get(product.id)
    }
}

class InventoryManager {
    constructor() {
        if (InventoryManager.instance) {
            return InventoryManager.instance
        }
        this.strategies = new Map()
        this.observers = []
        this.warehouses = new Map()
    }

    getInstance() {
        return new InventoryManager()
    }
    addWarehouses(warehouse) {
        this.warehouses.set(warehouse.id, warehouse)
    }
    addProductToWarehouse(warehouseId, product, qty) {
        const warehouse = this.warehouses.get(warehouseId)
        if (warehouse) {
            warehouse.addProduct(product, qty)
        }
    }
    removeFromWarehouse(warehouseId, product) {
        const warehouse = this.warehouses.get(warehouseId)
        if (warehouse) {
            warehouse.removeProduct(product, qty)
        }
    }
    setStartegy() {
        this.strategies.set(category, strategy)
    }
    checkAndReplinsh() {
        this.warehouses.foreEach((warehouse) => {
            warehouse.foreEach((products) => {
                if (product.isLowStock()) {
                    this.notifyObservers(product);
                    const strategy = this.strategies.get(product.category);
                    if (strategy) {
                        strategy.replenish(product, product.threshold * 2); // Replenish double the threshold
                    }
                }
            })
        })
    }
}