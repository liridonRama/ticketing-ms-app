export enum OrderStatus {
  /** When the order has been created but the ticket it is trying to order has not been reserved */
  Created = 'created',

  /** The ticket the order is trying to reserve is set to cancelled when:
   * - the ticket has already been reserved
   * - the user has cancelled the order
   * - the order has expired before payment
   * */
  Cancelled = 'cancelled',

  /** The order has successfully reserved the ticket */
  AwaitingPayment = 'awaiting:payment',

  /** The order has successfully reserved the ticket and the user has provided payment successfully */
  Complete = 'complete',
}