
import { PlaceOrder } from './application/PlaceOrder.js';

import { InMemoryOrderRepository } from './adapters/secondary/InMemoryOrderRepository.js';
import { StaticCatalog } from './adapters/secondary/StaticCatalog.js';
import { FakePayment } from './adapters/secondary/FakePayment.js';
import { ConsoleNotifier } from './adapters/secondary/ConsoleNotifier.js';

import { createHttpServer } from './adapters/primary/httpServer.js';

// Création des adaptateurs secondaires
const orderRepository = new InMemoryOrderRepository();
const catalog = new StaticCatalog();
const payment = new FakePayment();
const notifier = new ConsoleNotifier();

// Horloge et générateur d'identifiants
const clock = {
  now: () => new Date().toISOString()
};

let compteur = 0;

const ids = {
  next: () => `CMD-${String(++compteur).padStart(4, '0')}`
};

// Injection des dépendances dans le cas d'utilisation
const placeOrder = new PlaceOrder({
  orderRepository,
  catalog,
  payment,
  notifier,
  clock,
  ids
});

// Création et démarrage du serveur HTTP
const server = createHttpServer({
  placeOrder,
  orderRepository
});

server.listen(3001, () => {
  console.log('Serveur démarré sur http://localhost:3001');
});
