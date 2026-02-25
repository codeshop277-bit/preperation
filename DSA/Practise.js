class FileSystemNode{
    constructor(name, modified, created){
        this.name = name
        this.modified = modified
        this.created = created
        this.children = new Map()
    }
    addChildren(child){
        if(this.children.get(child.name)){
            throw new Error('alreadt')
        }
        this.children.set(child.name, child)
        this.modified = new Date()
    }
    getChild(child){
        return this.children.get(child.name)
    }
    deleteChild(child){
        this.children.delete(child.name)
        this.modified = new Date()
    }
    display(depth = 0){
        console.log(this.name)
    }
}
class File extends FileSystemNode{
    constructor(name, extension, content){
        super(name);
        this.extension = extension
        this.content = content
    }
    setContent(content){
        this.content = content
        this.modified = new Date()
    }
    getContent(){
        return this.content
    }
    display(depth = 0){
        console.log(`${this.name}_${this.extension}`)
    }
}

class Directory extends FileSystemNode{
    constructor(name){
        super(name)
    }
    display(depth = 0){
        for(let child of this.children.values()){
            child.display(depth)
        }
    }
}
class FileSystem{
    constructor(path){
        this.root = "/"
    }
    splitPath(path){
        return path.replace(/^\/+/, '').split('')
    }
    getNode(path){
        const components = this.splitPath(path);
        let current = this.root
        for(let i=0; i< components.length; i++){
            const name = components[i];
            const child = current.getChild(name);
            if(!child){
                //Create a node
                const isFile = name.includes('.');
                child = isFile? new File(name.split('.')[0], `.${name.split('.').slice(1).join('.')}`) : new Directory(name)
                current.addChildren(child)
            }
            current = child
        }
        return current
    }
    createPath(path){
        return this.getNode(path)
    }
    setFileContent(path, content){
        const node = this.getNode(path);
        if(! node instanceof File){
            throw new Error('not a file')
        }
        node.setContent(content)
    }
    setFileContent(path){
        const node = this.getNode(path);
        if(! node instanceof File){
            throw new Error('not a file')
        }
        node.getContent()
    }
    deletePath(path){
        const components = this.splitPath(path);
        if(components.length ===0 ){
            throw new Error('Cannot delete root folder')
        }
        const parentPath = "/" + components.slice(0, -1).join("/");
        const name = components[components.length -1];
        const parent = this.getNode(parentPath)
        parent.removeChild(name);
    }
}