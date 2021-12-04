const Table = require('../models/Table')
const ApiError = require('../exceptions/api-error')
const TableDto = require('../dto/table-dto')

class TableService {
    async add(tableNum,capacity,isAvailable,isInside) {
        const existsTable = await Table.findOne({tableNum})
        if(existsTable){
            throw ApiError.BadRequest(`Table with number ${tableNum} Already Exists`)
        }
        const table = await Table.create({tableNum,capacity,isAvailable,isInside})
        return TableDto.tableToDto(table)
    }
    async reserve(tableNum){
        const table = await Table.findOne({tableNum})
        if (!table) {
            throw ApiError.BadRequest("Table is not exists")
        }
        if(!table.isAvailable){
            throw ApiError.BadRequest("Table is already reserved")
        }
        table.isAvailable = false;
        await table.save()
    }
    async release(tableNum){
        const table = await Table.findOne({tableNum})
        if (!table) {
            throw ApiError.BadRequest("Table is not exists")
        }
        if(table.isAvailable){
            throw ApiError.BadRequest("Table is already free")
        }
        table.isAvailable = true;
        await table.save()
    }
    async edit(tableNum,capacity,isAvailable,isInside) {
        const table = await Table.findOne({tableNum})
        if (!table) {
            throw ApiError.BadRequest("Table is not exists")
        }
        if(capacity){
            table.capacity = capacity
        }
        if(typeof isAvailable === "boolean"){
            table.isAvailable = isAvailable
        }
        if(typeof isInside === "boolean"){
            table.isInside = isInside
        }
        await table.save()
        return TableDto.tableToDto(table)
    }

    async getAll() {
        const tables = await Table.find({})
        return tables.map(table => TableDto.tableToDto(table))
    }

    async getOne(tableNum) {
        const table = await Table.findOne({tableNum})
        return TableDto.tableToDto(table)
    }

    async delete(tableNum) {
        const table = await Table.findOne({tableNum})
        if (!table) {
            throw ApiError.BadRequest("Table does not exists")
        }
        await Table.findOneAndDelete({tableNum})
    }


}

module.exports = new TableService();