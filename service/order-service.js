
const Order = require('../models/Order')
const User = require('../models/User')
const ApiError = require('../exceptions/api-error')
const OrderDto = require('../dto/order-dto')
const UserDto = require('../dto/user-dto')
const ProductService = require('./product-service')
class OrderService {
    async createOrder(orderedBy,orderedItems,reservedTable,cid) {
        let currItem
        for (const item of orderedItems) {
            currItem = await ProductService.getOneProduct(item.productName)
            if(!currItem){
                throw ApiError.BadRequest("Attempt to add non-exist product")
            }
            item.price = currItem.salePrice || currItem.price
        }
        const order = await Order.create({orderedBy, orderedItems,reservedTable,cid})
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
        if(order.cid === "Guest"){
            return
        }
        const points = (order.orderedItems
            .map(i => i.salePrice ? i.salePrice * i.quantity : i.price * i.quantity)
            .reduce((sum, price) => sum + price, 0))*0.1
        const user = await User.findOne({cid:order.cid})
        if(!user){
            return
        }
        user.points = Math.ceil(user.points + points)
        await user.save()
    }
    async getOrder(orderId) {
        const order = await Order.findOne({_id: orderId})
        if(!order){
            throw ApiError.BadRequest("Order does not exists")
        }
        return OrderDto.orderToDto(order)
    }
    async getActiveOrders() {
        const orders = await Order.find({status:"In-Progress"})
        if(!orders){
            return []
        }
        return orders.map(or =>OrderDto.orderToDto(or))
    }
    async getUser(cid) {
        const user = await User.findOne({cid})
        if(!user){
            throw ApiError.BadRequest("None Exist user")
        }
        if(user.userType !== "Member"){

            throw ApiError.BadRequest(`Employee get on your member account!!!`)
        }
        return new UserDto(user.cid,user.name,user.type,user.points)
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