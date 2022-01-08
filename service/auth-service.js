const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const ApiError = require('../exceptions/api-error')
const UserDto = require('../dto/user-dto')

class AuthService {
    async registerBody(cid,password){
        const oldUser = await User.findOne({cid});
        if (oldUser) {
            throw ApiError.BadRequest("User Already Exist. Please Login")
        }
        const encryptedPassword = await bcrypt.hash(password, 7);
        return encryptedPassword
    }
    signToken(user) {
        const payload = {user: {cid: user.cid, type: user.userType}}
        return jwt.sign(payload, process.env.TOKEN_KEY, {expiresIn: "48h",});
    }

    async login(cid, password) {
        const user = await User.findOne({cid});
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw ApiError.BadRequest("Invalid ID or password")
        }
        return this.signToken(user);
    }

    async register(cid, password, name) {
        const encryptedPassword = await this.registerBody(cid,password);
        const newUser = await new User(
            {
                name,
                cid,
                password: encryptedPassword,
                userType: "Member"
            })
        await newUser.save()
        return this.signToken(newUser)
    }
    async registerStaff(cid, password, name,type) {
        const encryptedPassword = await this.registerBody(cid,password);
        const newUser = await new User(
            {
                name,
                cid,
                password: encryptedPassword,
                userType: type
            })
        await newUser.save()
        return new UserDto(newUser.cid,newUser.name,newUser.userType,newUser.points)
    }
    async me(userId) {
        const user = await User.findOne({cid:userId});
        if (!user) {
            throw ApiError.BadRequest("User does not exist")
        }
        return new UserDto(user.cid, user.name,user.userType,user.points)

    }

}

module.exports = new AuthService();