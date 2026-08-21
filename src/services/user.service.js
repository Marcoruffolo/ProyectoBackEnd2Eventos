import { UserDAO } from "../dao/user.dao.js";
import { UserRepository } from "../repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/hashing.js";

const userRepository = new UserRepository(new UserDAO())

export const registerUser = async ({ first_name, last_name, email, password}) => {
    const existingUser = await userRepository.getByEmail(email)
    if(existingUser){
        throw new Error("Ya existe un usuario con ese email")
    }
    const hashedPassword = await createHash(password)

    const user = await userRepository.create({ first_name, last_name, email, password: hashedPassword, role: "user"})

    return user;
}

export const loginUser = async(email,password) => {
    const existingUser = await userRepository.getByEmail(email)

    if(!existingUser){
        throw new Error("Credenciales invalidas")
    }

    const checkPassword = await isValidPassword(password,existingUser.password)

    if(!checkPassword){
        throw new Error("Credenciales invalidas")
    }

    return existingUser;
}