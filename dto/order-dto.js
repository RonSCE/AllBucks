module.exports = class OrderDto {
    orderId;
    orderedBy;
    status;
    orderedItems;
    createdAt;
    updatedAt;
    constructor(orderId,orderedBy,status,orderedItems,createdAt,updatedAt) {
        this.orderId = orderId
        this.orderedBy = orderedBy
        this.status = status
        this.orderedItems = orderedItems
        this.createdAt = createdAt
        this.updatedAt = updatedAt
        console.log(typeof this.orderedItems )
    }
    static orderToDto(order){
        return new OrderDto(order._id,order.orderedBy,order.status,
            order.orderedItems,order.createdAt,order.updatedAt)
    }

}
