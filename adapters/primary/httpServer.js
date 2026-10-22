
import { createServer } from 'node:http';

export function createHttpServer({ placeOrder, orderRepository }) {
  return createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // Envoyer une réponse JSON
    function send(statusCode, data) {
      res.writeHead(statusCode);
      res.end(JSON.stringify(data));
    }

    try {
      // POST /orders : créer une commande
      if (req.method === 'POST' && req.url === '/orders') {
        let body = '';

        for await (const chunk of req) {
          body += chunk;
        }

        const input = JSON.parse(body);
        const order = await placeOrder.handle(input);

        return send(
          order.statut === 'PAYEE' ? 201 : 402,
          order.toJSON()
        );
      }

      // GET /orders/:id : retrouver une commande
      const match = req.url.match(/^\/orders\/([^/]+)$/);

      if (req.method === 'GET' && match) {
        const id = decodeURIComponent(match[1]);
        const order = await orderRepository.findById(id);

        if (!order) {
          return send(404, { error: 'Commande introuvable' });
        }

        return send(200, order.toJSON());
      }

      // Route inexistante
      return send(404, { error: 'Route introuvable' });

    } catch (error) {
      // Erreur de validation, JSON invalide ou autre erreur de traitement
      return send(400, {
        error: error.message || 'Erreur de traitement'
      });
    }
  });
}
