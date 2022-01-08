module.exports = class OrderDto {
    orderId;
    orderedBy;
    status;
    orderedItems;
    createdAt;
    updatedAt;
    reservedTable;
    constructor(orderId,orderedBy,status,orderedItems,createdAt,updatedAt,reservedTable) {
        this.orderId = orderId
        this.orderedBy = orderedBy
        this.status = status
        this.orderedItems = orderedItems
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        this.reservedTable = reservedTable
    }
    static orderToDto(order){
        return new OrderDto(order._id,order.orderedBy,order.status,
            order.orderedItems,order.createdAt,order.updatedAt,order.reservedTable)
    }

}
