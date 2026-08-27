export const TicketDTO = (ticket) => {
    return {
        id: ticket._id,
        event: ticket.event,
        user: ticket.user,
        quantity: ticket.quantity,
        status: ticket.status,
        reservationCode: ticket.reservationCode,
        createdAt: ticket.createdAt,
        cancelledAt: ticket.cancelledAt
    }
}
