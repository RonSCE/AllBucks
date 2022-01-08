const orderService = require('../service/order-service');
const ApiError = require('../exceptions/api-error');


class OrdersController {
    async create(req, res, next) {
        try {
            const {orderedBy,orderedItems,reservedTable} = req.body;
            const order = await orderService.createOrder(orderedBy,orderedItems,reservedTable)
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
            const orders = await orderService.getActiveOrders()
            res.json({orders})
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
    async completeOrder(req, res, next) {
        try {
            const orderId = req.params.id;
            await orderService.editStatus(orderId,"Completed")
            await orderService.givePoints(orderId)
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
    async chargePoints(req, res, next) {
        try {
            const cid = req.params.id;
            const {amount} = req.body;
            await orderService.chargePoints(cid,amount)
            res.json({resultCode: "Success"})
        } catch (err) {
            next(err)
        }
    }


}

module.exports = new OrdersController()