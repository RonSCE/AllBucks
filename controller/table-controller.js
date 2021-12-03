const tableService = require('../service/table-service');
const ApiError = require('../exceptions/api-error');


class TableController {
    static checkUserType(req){
        const {type} = req.user;
        if(type !== "Admin" && type!=="Barista") {
            throw (ApiError.UnauthorizedError())
        }
    }
    async add(req, res, next) {
        try {
            TableController.checkUserType(req)
            const {tableNum,capacity,isAvailable,isInside} = req.body;
            const table = await tableService.add(tableNum,capacity,isAvailable,isInside)
            res.json({table})
        } catch (err) {
            next(err)
        }
    }

    async edit(req, res, next) {
        try {
            TableController.checkUserType(req)
            const tableNum = req.params.tableNum
            const {capacity,isAvailable,isInside} = req.body
            const table = await tableService.edit(tableNum,capacity,isAvailable,isInside)
            res.json({table})
        } catch (err) {
            next(err)
        }
    }

    async getAll(req, res, next) {
        try {
            const tables = await tableService.getAll()
            res.json({tables})
        } catch (err) {
            next(err)
        }
    }

    async getOne(req, res, next) {
        try {
            const tableNum = req.params.tableNum;
            const table = await tableService.getOneProduct(tableNum)
            res.json({table})
        } catch (err) {
            next(err);
        }
    }
    async reserve(req, res, next) {
        try {
            const tableNum = req.params.tableNum;
            const table = await tableService.reserve(tableNum)
            res.json({result: "Success"})
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            TableController.checkUserType(req)
            const tableNum = req.params.tableNum;
            await tableService.delete(tableNum)
            res.json({result: "Success"})
        } catch (err) {
            next(err);
        }
    }


}

module.exports = new TableController()