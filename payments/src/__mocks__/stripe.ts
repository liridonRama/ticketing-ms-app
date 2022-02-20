export const stripe = {
  charges: {
    create: jest.fn(async () => ({ id: 'id' })),
  }
}