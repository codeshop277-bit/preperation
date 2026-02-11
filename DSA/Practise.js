class ServerConfig{
    constructor(port, host){
        this.port = port
    }
}

class ServerConfigBuilder{
    constructor(host, port){
        this.host = host
    }
    enableSSl(){
        this.ssl = true
        return this
    }
    build(){
        return new ServerConfig(this)
    }
}

const server = new ServerConfigBuilder(2000, 2525)
.enableSSl()
.build();