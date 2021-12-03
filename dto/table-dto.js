module.exports = class TableDto {
    tableNum;
    capacity;
    isAvailable;
    isInside;
    constructor(tableNum,capacity,isAvailable,isInside) {
        this.tableNum = tableNum
        this.capacity = capacity
        this.isAvailable = isAvailable
        this.isInside = isInside
    }
    static tableToDto(table){
        return new TableDto(table.tableNum,table.capacity,
            table.isAvailable,table.isInside)
    }
}
