# TP2 — Commande avec architecture hexagonale

Ce projet illustre le traitement d'une commande dans une architecture hexagonale. Le domaine porte les règles métier, le cas d'utilisation orchestre la commande, et les adaptateurs fournissent les entrées HTTP ainsi que les services de paiement, catalogue, notification et stockage.

## Structure

- `domain/` : modèle et règles métier de la commande.
- `application/` : cas d'utilisation de passage de commande.
- `adapters/primary/` : serveur HTTP, point d'entrée de l'application.
- `adapters/secondary/` : adaptateurs secondaires (paiement fictif, catalogue statique, stockage en mémoire et notification console).
- `adr/` : décision d'architecture, notamment l'ADR-0001.

Le domaine ne dépend pas des adaptateurs. Les ports permettent de remplacer les implémentations techniques, par exemple le paiement fictif par un vrai prestataire et le stockage en mémoire par PostgreSQL.

## Lancer l'application

Depuis la racine du dépôt :

```sh
node seance2-architecture/tp2-Steve_JIOKENG_WOTEU/main.js
```

Le serveur écoute sur `http://localhost:3001`. Les exemples de requêtes sont dans [`requests.http`](./requests.http).

## Vérifier

Toujours depuis la racine du dépôt :

```sh
node --test seance2-architecture/tp2-Steve_JIOKENG_WOTEU/Order.test.js seance2-architecture/tp2-Steve_JIOKENG_WOTEU/PlaceOrder.test.js
npm run lint:archi
```
