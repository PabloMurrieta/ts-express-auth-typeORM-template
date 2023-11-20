import { Request, Response } from "express";
import User from "../models/User";
import generateJWT from "../utils/generateJWT";
import generateId from "../utils/generateId";
import dataSource from "../config/db";


export const register = async (req: Request, res: Response) => {
    try {

        const { email, name, lastName, password, username } = req.body;

        const userRepository = dataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (user) {
            return res.status(401).json({ msg: "user exist" });
        }

        // Create new user
        const newUser = userRepository.create({ email, name, lastName, password, username });
        const savedUser = await userRepository.save(newUser);
        console.log(req.body);
        res.status(201).json({ msg: 'user: ' + savedUser });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {

        const { email, password } = req.body;


        const userRepository = dataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            const error = new Error("User not found");
            return res.status(403).json({ msg: error.message });
        }

        // Comprobar si el ususario está confirmado
        if (!user.confirmed) {
            const error = new Error("Account not confirmed");
            return res.status(403).json({ msg: error.message });
        }

        if (await user.validatePassword(password)) {
            res.status(200).json({
                id: user.id,
                nombre: user.name,
                lastName: user.lastName,
                email: user.email,
                token: generateJWT(user.id),
            });
        }
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const userRepository = dataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            const error = new Error("User not foundded");
            return res.status(403).json({ msg: error.message });
        }

        user.token = "";
        await userRepository.save(user);
        return res.status(200).json({ msg: "User logged out" });

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }

    res.send("logout");
};

export const confirmAccount = async (req: Request, res: Response) => {
    const { token } = req.params; // desde la url es por req.params

    try {
        const userRepository = dataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { token } });

        if (!user) {
            const error = new Error("Not a valid token");
            return res.status(401).json({ msg: error.message });
        }

        user.token = '';
        user.confirmed = true;
        await userRepository.save(user);
        res.status(200).json({ msg: "Account confirmed" });

    } catch (error: any) {
        console.log(error.message);
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;


        const userRepository = dataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            const error = new Error("User not found");
            return res.status(401).json({ msg: error.message });
        }

        user.token = generateId();
        await userRepository.save(user);
        // send email

        res.status(200).json({ msg: "Email sent" });
    } catch (error) { }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const userRepository = dataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { token } });

        if (!user) {
            const error = new Error("There was an error");
            return res.status(400).json({ msg: error.message });
        }

        user.token = "";
        user.password = password;
        await userRepository.save(user);
        res.status(200).json({ msg: "Password reseted" });
    } catch (error: any) {

        console.error(error.message);
    }
};

export const validateToken = async (req: Request, res: Response) => {
    const { token } = req.params;
    try {

        const userRepository = dataSource.getRepository(User);

        const user = await userRepository.findOne({ where: { token } });
        if (!user) {
            const error = new Error("There was an error");
            return res.status(400).json({ msg: error.message });
        }
        res.status(200).json({ msg: "Token validated" });
    } catch (error) {
        console.log(error)
    }
};
