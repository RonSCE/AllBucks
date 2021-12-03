module.exports = class UserDto {
    cid;
    type;
    name;
    constructor(cid, name, type) {
        this.cid = cid
        this.name = name
        this.type = type
    }
}