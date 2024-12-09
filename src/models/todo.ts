import moment from "moment";
import { Schema, model, Document, Model } from "mongoose";

export interface Itodo {
    title: string;
    description: string;
    due_date: moment.Moment;
    user_id: string;
    is_delete: boolean;
    set_reminder:moment.Moment;
    is_completed:boolean;
    reminder_email:string;
}

export interface ItodoModelInterface extends Itodo, Document { }

interface todoModel extends Model<ItodoModelInterface> { save(person: string): string; }

const todoSchema: Schema<ItodoModelInterface> = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    due_date: { type: Date, required: true },
    user_id: { type: String, required: true },
    is_delete: { type: Boolean, require: true },
    set_reminder: { type: Date, required: false },
    is_completed:{type:Boolean, required:true},
    reminder_email:{type:String, required:false}
}, {
    timestamps: true
});

export let todoModelSchema = model<ItodoModelInterface, todoModel>("todo", todoSchema);
