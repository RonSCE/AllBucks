module.exports = class UserDto {
    cid;
    type;
    name;
    points;
    constructor(cid, name, type,points) {
        this.cid = cid
        this.name = name
        this.type = type
        this.points = points
    }
}