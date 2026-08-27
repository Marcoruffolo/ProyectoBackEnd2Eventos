import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

export const sendTicketConfirmationEmail = async (to, event, ticket) => {
    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: `Inscripción confirmada: ${event.title}`,
        text: `Te inscribiste a "${event.title}" el ${new Date(event.date).toLocaleDateString()} en ${event.location}. Código de reserva: ${ticket.reservationCode}`
    })
}
