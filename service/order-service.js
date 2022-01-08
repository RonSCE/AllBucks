
const Order = require('../models/Order')
const User = require('../models/User')
const ApiError = require('../exceptions/api-error')
const OrderDto = require('../dto/order-dto')
const ProductService = require('./product-service')
class OrderService {
    async createOrder(orderedBy,orderedItems,reservedTable) {
        let currItem
        for (const item of orderedItems) {
            currItem = await ProductService.getOneProduct(item.productName)
            if(!currItem){
                throw ApiError.BadRequest("Attempt to add non-exist product")
            }
            item.price = currItem.salePrice || currItem.price
        }
        const order = await Order.create({orderedBy, orderedItems,reservedTable})
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
    async givePoints(orderId) {
        const order = await Order.findOne({_id:orderId})
        if(order.orderedBy === "Guest"){
            return
        }
        const points = (order.orderedItems
            .map(i => i.salePrice ? i.salePrice * i.quantity : i.price * i.quantity)
            .reduce((sum, price) => sum + price, 0))*0.05
        const user = await User.findOne(order.orderedBy)
        if(!user){
            return
        }
        user.points += points
        await user.save()
    }
    async getOrder(orderId) {
        const order = await Order.findOne({_id: orderId})
        return OrderDto.orderToDto(order)
    }
    async getActiveOrders() {
        const orders = await Order.find({status:"In-Progress"})
        return orders.map(or =>OrderDto.orderToDto(or))
    }
    async chargePoints(cid,amount) {
        const user = await User.findOne({cid})
        if(!user){
            throw ApiError.BadRequest("None Exist user")
        }
        let points = user.points - amount
        user.points = points
        await user.save()
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