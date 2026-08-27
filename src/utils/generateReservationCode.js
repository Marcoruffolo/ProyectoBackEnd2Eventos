export const generateReservationCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let code = ""
    for(let i = 0; i < 4; i++){
        code += chars[Math.floor(Math.random() * chars.length)]
    }
    return `EVT-${code}`
}
