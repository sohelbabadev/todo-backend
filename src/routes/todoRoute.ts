import moment from "moment"
import { todoModelSchema } from "../models/todo"
import { getUserFromToken, sanitizeTodo } from "../utils"

export const createTodo = async (req: any, res: any) => {
    try {
        const title: string = req.body.title
        const description: string = req.body.description
        const due_date: Date = req.body.due_date
        const is_completed: boolean = req.body.is_completed
        const set_reminder: moment.Moment = req.body.set_reminder

        if (!title || !description) {
            return res.status(500).send('required parameter not found. title , description and due_date is required')
        }

        //check token expire or not also get id from it
        let user = await getUserFromToken(req.cookies.token)

        if (user) {
            let todo: any
            todo = new todoModelSchema({})
            todo.is_delete = false
            todo.user_id = user._id
            todo.due_date = moment()

            if (title !== undefined) todo.title = title
            if (description !== undefined) todo.description = description
            if (due_date !== undefined) todo.due_date = moment(due_date)
            if (is_completed !== undefined) todo.is_completed = is_completed
            if (set_reminder !== undefined) todo.set_reminder = set_reminder

            await todo.save()
            console.log('todo created/updated')

            return res.status(200).send(sanitizeTodo(todo, user))
        } else {
            return res.status(500).send({ error: "Unable to process request." })
        }



    } catch (err) {
        console.log('error while upsert Todo', err)
        return res.status(500).send({
            error: err,
            msg: "Error while upsert todo."
        })
    }
}

export const updateTodo = async (req: any, res: any) => {
    try {
        const id: string = req.body.id
        const title: string = req.body.title
        const description: string = req.body.description
        const due_date: Date = req.body.due_date
        const is_completed: boolean = req.body.is_completed

        if (!id) {
            return res.status(500).send('required parameter not found. id is required')
        }

        //check token expire or not also get id from it
        let user = await getUserFromToken(req.cookies.token)

        if (user) {
            let todo: any = await todoModelSchema.findOne({ _id: id, is_delete: false })

            if (!todo) {
                return res.status(500).send("todo not found with given id")
            }

            if (moment(todo.createdAt).diff(moment(), 'days') == 0) {
                if (title !== undefined) todo.title = title
                if (description !== undefined) todo.description = description
                if (due_date !== undefined) todo.due_date = moment(due_date)
                if (is_completed !== undefined) todo.is_completed = is_completed
                await todo.save()
                console.log('todo created/updated')

                return res.status(200).send(sanitizeTodo(todo, user))
            } else {

                if (is_completed !== undefined) todo.is_completed = is_completed
                await todo.save()
                console.log('todo created/updated')

                return res.status(200).send({ msg: "you cannot update another day todo's" })
            }

        } else {
            return res.status(500).send({ error: "Unable to process request." })
        }



    } catch (err) {
        console.log('error while upsert Todo', err)
        return res.status(500).send({
            error: err,
            msg: "Error while upsert todo."
        })
    }
}

export const fetchTodo = async (req: any, res: any) => {
    try {
        const id: string = req.body.id
        const date: string = req.body.date

        let user: any = await getUserFromToken(req.cookies.token)

        if (user) {
            let match: { _id?: string, createdAt?: any, is_delete: boolean, user_id: string } = {
                user_id: user._id,
                is_delete: false
            }
            let todo: any
            if (id) {
                match._id = id
                todo = await todoModelSchema.findOne(match)
                return res.status(200).send(sanitizeTodo(todo, user))
            } else {
                if (date !== undefined) match.createdAt = { $gt: new Date(date) }
                todo = await todoModelSchema.find(match)
                let todoData = todo.map((t: any) => sanitizeTodo(t, user))
                console.log('todo get')
                return res.status(200).send(todoData)
            }

        } else {
            return res.status(500).send({ error: 'unable to process request.' })
        }

    } catch (err) {
        console.log('error while fetch Todo', err)
        return res.status(500).send({
            error: err,
            msg: "Error while fetch todo."
        })
    }
}

export const deleteTodo = async (req: any, res: any) => {
    try {
        const id: string = req.body.id

        if (!id) {
            return res.status(500).send("require parameter not found")
        }

        let user: any = getUserFromToken(req.cookies.token)

        if (user) {
            let todo: any = await todoModelSchema.findOne({ _id: id, is_delete: false })
            if (!todo) {
                return res.status(500).send("todo not found with provided id")
            }

            if (moment(todo.createdAt).diff(moment(), 'days') == 0) {
                todo.is_delete = true
                await todo.save()
                console.log('todo is deleted')
                return res.status(200).send({ msg: "todo deleted" })
            } else {
                return res.status(200).send({ msg: "you can not delete other day's todo." })
            }

        } else {
            return res.status(500).send({ msg: "unable to process this request" })
        }

    } catch (err) {
        console.log('error while delete Todo', err)
        return res.status(500).send({
            error: err,
            msg: "Error while delete todo."
        })
    }
}
