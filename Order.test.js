
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Order } from './domain/Order.js';

test('une commande neuve est EN_ATTENTE et calcule son total', () => {
  const order = new Order({
    id: 1,
    customerId: 101,
    lines: [
      { sku: 'CLAVIER', qty: 2, unitPrice: 49 },
      { sku: 'SOURIS', qty: 1, unitPrice: 19 }
    ],
    createdAt: new Date().toISOString()
  });

  assert.equal(order.total, 117);
  assert.equal(order.statut, 'EN_ATTENTE');
});

test('refuse une commande vide, sans client ou avec une quantité invalide', () => {
  const base = {
    id: 1,
    customerId: 101,
    lines: [{ sku: 'CLAVIER', qty: 1, unitPrice: 49 }],
    createdAt: new Date().toISOString()
  };

  // Commande vide
  assert.throws(
    () => new Order({ ...base, lines: [] }),
    /au moins une ligne/
  );

  // Client absent
  assert.throws(
    () => new Order({ ...base, customerId: null }),
    /client est obligatoire/
  );

  // Quantité égale à 0
  assert.throws(
    () => new Order({
      ...base,
      lines: [{ sku: 'CLAVIER', qty: 0, unitPrice: 49 }]
    }),
    /quantité doit être un entier supérieur à 0/
  );

  // Quantité décimale
  assert.throws(
    () => new Order({
      ...base,
      lines: [{ sku: 'CLAVIER', qty: 1.5, unitPrice: 49 }]
    }),
    /quantité doit être un entier supérieur à 0/
  );
});

test('une commande ne change de statut qu’une fois', () => {
  const order = new Order({
    id: 2,
    customerId: 102,
    lines: [{ sku: 'SOURIS', qty: 1, unitPrice: 19 }],
    createdAt: new Date().toISOString()
  });

  order.marquerPayee();

  assert.equal(order.statut, 'PAYEE');

  // Impossible de refuser une commande déjà payée
  assert.throws(
    () => order.marquerRefusee('Paiement déjà effectué'),
    { message: 'Commande déjà traitée' }
  );

  // Le statut reste inchangé
  assert.equal(order.statut, 'PAYEE');
});
