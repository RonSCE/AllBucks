const Order = require('../models/Order')
const ApiError = require('../exceptions/api-error')
const OrderDto = require('../dto/order-dto')
const ProductService = require('./product-service')
class OrderService {
    async createOrder(orderedBy,orderedItems) {
        let currItem
        for (const item of orderedItems) {
            currItem = await ProductService.getOneProduct(item.productName)
            if(!currItem){
                throw ApiError.BadRequest("Attempt to add non-exist product")
            }
            item.price = currItem.salePrice || currItem.price
        }
        const order = await Order.create({orderedBy, orderedItems})
        return OrderDto.orderToDto(order)
    }
    async editStatus(orderId,status) {
        const order = await Order.findOne({_id:orderId})
        if (!order) {
            throw ApiError.BadRequest("Order does not exists")
        }
        order.status = status
        await order.save()
        return OrderDto.orderToDto(order)
    }
    async getOrder(orderId) {
        const order = await Order.findOne({_id: orderId})
        return OrderDto.orderToDto(order)
    }
    async getActiveOrders() {
        const orders = await Order.find({status:"In-Progress"})
        return orders.map(or =>OrderDto.orderToDto(or))
    }
    async editOrder(orderId,orderedItems) {
        let currItem
        for (const item of orderedItems) {
            currItem = await ProductService.getOneProduct(item.productName)
            if(!currItem){
                throw ApiError.BadRequest("Attempt to add non-exist product")
            }
            item.price = currItem.salePrice || currItem.price
        }
        const order = await Order.findOne({_id: orderId})
        if (!order || order.status !== "In-Progress") {
            throw ApiError.BadRequest("Order does not exists or cannot be edited")
        }
        order.orderedItems = orderedItems;
        await order.save()
        return OrderDto.orderToDto(order)
    }


}

module.exports = new OrderService();