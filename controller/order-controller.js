const orderService = require('../service/order-service');
const ApiError = require('../exceptions/api-error');


class OrdersController {
    async create(req, res, next) {
        try {
            const {orderedBy,orderedItems} = req.body;
            const order = await orderService.createOrder(orderedBy,orderedItems)
            res.json({order})
        } catch (err) {
            next(err)
        }
    }
    async getOrder(req, res, next) {
        try {
            const orderId = req.params.id;
            const order = await orderService.getOrder(orderId)
            res.json({order})
        } catch (err) {
            next(err);
        }
    }
    async getActiveOrders(req, res, next) {
        try {
            const {type} = req.user;
            if(type!=="Admin" && type!=="Barista"){
                next(ApiError.UnauthorizedError("Access Denied"))
            }
            const order = await orderService.getActiveOrders()
            res.json({order})
        } catch (err) {
            next(err);
        }
    }
    async editStatus(req, res, next) {
        try {
            const orderId = req.params.id;
            const {status} = req.body
            const order = await orderService.editStatus(orderId,status)
            res.json({order})
        } catch (err) {
            next(err)
        }
    }
    async cancelOrder(req, res, next) {
        try {
            const orderId = req.params.id;
            await orderService.editStatus(orderId,"Cancelled")
            res.json({resultCode: "Success"})
        } catch (err) {
            next(err);
        }
    }
    async edit(req, res, next) {
        try {
            const orderId = req.params.id;
            const {orderedItems} = req.body;
            const order = await orderService.editOrder(orderId,orderedItems)
            res.json({order})
        } catch (err) {
            next(err)
        }
    }


}

module.exports = new OrdersController()