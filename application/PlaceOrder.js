
import { Order } from '../domain/Order.js';

export class PlaceOrder {
  constructor({ orderRepository, catalog, payment, notifier, clock, ids }) {
    this.orderRepository = orderRepository;
    this.catalog = catalog;
    this.payment = payment;
    this.notifier = notifier;
    this.clock = clock;
    this.ids = ids;
  }

  async handle({ customerId, items }) {
    // 1. Chercher le prix de chaque produit
    const lines = items.map(({ sku, qty }) => {
      const unitPrice = this.catalog.priceOf(sku);

      if (unitPrice === undefined) {
        throw new Error(`Produit inconnu : ${sku}`);
      }

      return { sku, qty, unitPrice };
    });

    // 2. Créer la commande
    const order = new Order({
      id: this.ids.next(),
      customerId,
      lines,
      createdAt: this.clock.now()
    });

    // 3. Tenter le paiement
    const result = await this.payment.charge({
      orderId: order.id,
      amount: order.total
    });

    // 4. Mettre à jour le statut selon le résultat du paiement
    if (result.ok) {
      order.marquerPayee();
    } else {
      order.marquerRefusee(result.reason);
    }

    // 5. Enregistrer la commande dans les deux cas
    await this.orderRepository.save(order);

    // 6. Notifier uniquement si la commande est payée
    if (result.ok) {
      await this.notifier.orderPlaced(order);
    }

    // 7. Renvoyer la commande
    return order;
  }
}
