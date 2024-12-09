import { Iuser, IuserModelInterface, userModelSchema } from "../models/user"
import { comparePassword, generateHashPassword, sanitizeUser } from "../utils"
import jwt from "jsonwebtoken"

export const userRegistration = async (req: any, res: any) => {
    try {
        const first_name: string = req.body.first_name
        const last_name: string = req.body.last_name
        const username: string = req.body.username
        const email: string = req.body.email
        const password: string = req.body.password
        const phone_number: string = req.body.phone_number
        const address: string = req.body.address

        if (!first_name || !username || !email || !password) {
            return res.status(500).send({ msg: "Required parameter not found. first_name, username, email and password are required." })
        }

        let user: IuserModelInterface | null = await userModelSchema.findOne({ email: email, is_delete: false })

        if (user) {
            return res.status(200).send({ msg: "User is already registerd with provide email id." })
        }

        //creating new user
        user = new userModelSchema({})
        user.first_name = first_name
        user.username = username
        user.email = email
        user.password = await generateHashPassword(password)
        user.is_delete = false

        if (last_name !== undefined) user.last_name = last_name
        if (address !== undefined) user.address = address
        if (phone_number !== undefined) user.phone_number = phone_number

        await user.save()
        console.log('user registration done.')

        return res.status(200).send(sanitizeUser(user))

    } catch (err) {
        console.log('error while user registration', err)
        return res.status(500).send({
            error: err,
            msg: "Error while registration."
        })
    }
}

export const authentication = async (req: any, res: any) => {
    try {
        const email: string = req.body.email
        const password: string = req.body.password

        if (!email || !password) {
            return res.status(500).send({ msg: "required parameter not found." })
        }

        let user: IuserModelInterface | null = await userModelSchema.findOne({ email: email, is_delete: false })

        if (!user) {
            return res.status(500).send({ msg: "Provided email id is not match." })
        }

        let compare_pass = await comparePassword(password, user.password)

        if (!compare_pass) {
            return res.status(500).send({ msg: "Provided Passoword is not match." })
        }

        //create token
        let token: string = jwt.sign({ id: user._id }, (process.env.PRIVATE_KEY || ""), { expiresIn: 60 * 60, })

        console.log('login done.')
        res.cookie('token', token, {
            httpOnly: false,
            secure: true,
            withCredentials: true
        })
        return res.status(200).send({ token: token, ...sanitizeUser(user), isLogin: true })
    } catch (err) {
        console.log('error while login', err)
        return res.status(500).send({
            error: err,
            msg: "Error while Login."
        })
    }
}

export const fetchUserById = async (req: any, res: any) => {
    try {

        let id: string = req.body.id

        if (!id) {
            return res.status(500).send({ msg: "Required parameter not found. id is required" })
        }

        let user: IuserModelInterface | null = await userModelSchema.findOne({ _id: id, is_delete: false })

        if (!user) {
            return res.status(500).send({ msg: "user not found with provided id." })
        }

        console.log('user found')
        return res.status(200).send(sanitizeUser(user))

    } catch (err) {
        console.log('error while fetch user by id', err)
        return res.status(500).send({
            error: err,
            msg: "Error while registration."
        })
    }
}