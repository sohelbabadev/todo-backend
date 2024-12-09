import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { IuserModelInterface, userModelSchema } from './models/user'
import { ItodoModelInterface, todoModelSchema } from './models/todo'

export async function generateHashPassword(password: string) {
    let salt: string = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

export async function comparePassword(password: string, hasPassword: string) {
    let res = await bcrypt.compare(password, hasPassword)
    return res
}

export function sanitizeUser(user: IuserModelInterface) {
    return {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username,
        address: user.address,
        phoneNumber: user.phone_number
    }
}

export async function getUserFromToken(token: string) {
    let decode: any = await jwt.decode(token)

    let checkTokenExpire = decode.exp * 1000 < Date.now()
    if (checkTokenExpire) {
        return undefined
    } else {
        let user: any = userModelSchema.findOne({ _id: decode.id, is_delete: false })
        return user
    }
}

export function sanitizeTodo(todo: ItodoModelInterface, user: IuserModelInterface) {
    return {
        id: todo?._id,
        title: todo.title,
        description: todo.description,
        due_date: todo.due_date,
        is_delete: todo.is_delete,
        is_completed: todo.is_completed,
        created_by: `${user?.first_name} ${user?.last_name || ""}`,
        modified_by: `${user?.first_name} ${user?.last_name || ""}`,
        reminder:todo.set_reminder,
        user_id: user._id,
        email: user.email
    }
}