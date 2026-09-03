import { registerUser } from "../../src/services/user.service.js";
import { connectTestDB, closeTestDB, clearTestDB } from "../setup/db.js";


beforeAll(async () => {
    await connectTestDB()
})

afterAll(async () => {
    await closeTestDB()
})

afterEach(async () => {
    await clearTestDB()
})

test("el rol del usuario debe ser user", async () => {
    const user = await registerUser({ first_name : "richard", last_name : "jackson", email : "richardjackson@gmail.com", password : "1234" })
    expect(user.role).toBe("user")
})

test("email ya existente", async () => {
    const user = await registerUser({ first_name: "james", last_name : "jackson", email : "jamesjackson@gmail.com", password : "3333"}) 

    await expect(registerUser({ first_name: "brad", last_name : "jackson", email : "jamesjackson@gmail.com", password : "2485"})).rejects.toThrow("Ya existe un usuario con ese email")
})


