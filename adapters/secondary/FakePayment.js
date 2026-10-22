
export class FakePayment {
  async charge({ orderId, amount }) {
    if (amount > 500) {
      return {
        ok: false,
        reason: 'Paiement refusé : montant supérieur à 500 €'
      };
    }

    return { ok: true };
  }
}
