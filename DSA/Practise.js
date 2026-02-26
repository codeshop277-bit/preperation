const fs = require("fs");

const LogLevel = {
    INFO: { value: 1, name: "INFO" },
    DEBUG: { value: 2, name: "DEBUG" },
    WARN: { value: 3, name: "WARN" },
    ERROR: { value: 4, name: "ERROR" },
}

class LogMessage {
    constructor(message, metadata, timestamp, level) {
        this.level = level
        this.message = message
        this.timestamp = new Date().toISOString()
        this.metadata = metadata
    }
}
class LogHandler {
    constructor(nextHandler, appender, formatter) {
        this.nextHandler = nextHandler
        this.appender = appender
        this.formatter = formatter
    }
    logMessage(message) {
        if (this.canHandle(message)) {
            const formatted = this.formatter ? this.formatter.format(message) : message
            if (this.appender) {
                this.appender.append(formatted)
            }
        }
        if (this.nextHandler) {
            this.nextHandler.logMessage(message)
        }
    }
    canHandle(message) {
        return false
    }
}
class InfoHandler extends LogHandler{
    canHandle(message){
        return message.level >= LogLevel.INFO.value
    }
}
class DebugHandler extends LogHandler{
    canHandle(message){
        return message.level >= LogLevel.DEBUG.value
    }
}
class WarnHandler extends LogHandler{
    canHandle(message){
        return message.level >= LogLevel.WARN.value
    }
}

class Appender {
    append(message) {
        //
    }
}
class ConsoleAppender extends Appender{
    append(message){
        console.log(message)
    }
}
class FileAppender extends Appender{
    constructor(filePath){
        super()
        this.filePath = filePath
    }
    append(message){
        fs.appendFileSync(this.filePath, message+ '\n')
    }
}
class Formatter {
    format(message) {
        //
    }
}
class SimpleFormatter extends Formatter {
    formate(message) {
        return `[${logMessage.timestamp}] [${logMessage.level.name}] ${logMessage.message} ${JSON.stringify(logMessage.metadata)}`
    }
}
class JSONFormatter extends Formatter {
    format(message) {
        return JSON.stringify({
            timestamp: message.timestamp,
            level: logMessage.level.name,
            message: logMessage.message,
            metadata: logMessage.metadata
        })
    }
}
class Logger{
    static getInstance(){
        if(!Logger.instance){
            Logger.instance = new Logger()
        }
        return Logger.instance
    }
    constructor(){
        this.headHandler = null
    }
    setHandlerChain(headHandler){
        this.headHandler = headHandler
    }
    logMessage(level, message, metadata){
        const newMsg = new LogMessage(level, message, metadata)
        if(this.headHandler){
            this.headHandler.logMessage(newMsg)
        }
    }
}
const logger = Logger.getInstance();
const consoleAppender = new ConsoleAppender();
const simpleFormatter = new SimpleFormatter();

const debugHandler = new DebugHandler(null, consoleAppender, simpleFormatter)
logger.setHandlerChain(debugHandler)

logger.logMessage(LogLevel.INFO, 'App Started')