import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import Client from '../../Db/Client';
import { Maybe } from '../../Utils/Maybe';

interface ILogin {
    email: string;
    password: string;
}

interface IUser {
    _id: ObjectId;
    email: string;
    password: string;
    salt: string;
}

interface ICreateUser {
    email: string;
    password: string;
    confirmPassword: string;
}

class AuthController {
    static async login(req: express.Request, res: express.Response) {
        const { body }: { body: ILogin } = req;
        const { email, password }: ILogin = body;
        if (!email || !password) {
            throw new Error('Parâmetros incorretos');
        }
        const user: Maybe<IUser> = await Client.db.collection('users').findOne({ email });
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        if (!bcrypt.compareSync(password, user.password)) {
            throw new Error('Credenciais erradas');
        }
        res.send({
            accessToken: jwt.sign({ userId: user._id.toHexString() }, process.env.SECRET_JWT, { expiresIn: '15m' }),
            refreshToken: jwt.sign({ userId: user._id.toHexString() }, process.env.SECRET_JWT, { expiresIn: '1h' }),
        });
    }

    static async createUser(req: express.Request, res: express.Response) {
        const { body }: { body: ICreateUser } = req;
        const { confirmPassword, email, password }: ICreateUser = body;

        if (!confirmPassword || !email || !password) {
            throw new Error('Parâmetros incorretos');
        }

        if (confirmPassword !== password) {
            throw new Error('Credenciais incorretas');
        }

        await Client.db.collection('users').insertOne({ email, password: bcrypt.hashSync(password, bcrypt.genSaltSync()) });
        const newUser: Maybe<IUser> = await Client.db.collection('users').findOne({ email });

        if (!newUser) {
            throw new Error('Erro ao criar o usuário');
        }

        res.send(newUser);
    }
}

export default AuthController;
