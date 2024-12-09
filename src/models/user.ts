import { Schema, model, Document, Model } from "mongoose";

export interface Iuser {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone_number: string;
    address: string;
    password: string;
    refersh_token: string;
    is_delete:boolean;
}

export interface IuserModelInterface extends Iuser, Document { }

interface userModel extends Model<IuserModelInterface> { save(person: string): string; }

const userSchema: Schema<IuserModelInterface> = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: false },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, required: false },
    refersh_token: { type: String, required: false },
    is_delete:{type:Boolean, require:true},
}, {
    timestamps: true
});

export let userModelSchema = model<IuserModelInterface, userModel>("user", userSchema);
