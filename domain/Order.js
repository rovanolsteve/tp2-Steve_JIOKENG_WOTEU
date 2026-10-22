// domain/Order.js : DOMAINE, aucun import
export class Order {
    #lines;
    #statut = 'EN_ATTENTE';
    #motif = null;

    constructor({ id, customerId, lines, createdAt }) {
        // 1. Vérifier que le client est obligatoire
        if (!customerId) {
            throw new Error('Le client est obligatoire');
        }

        // 2. Vérifier qu'il existe au moins une ligne
        if (!Array.isArray(lines) || lines.length === 0) {
            throw new Error('La commande doit contenir au moins une ligne');
        }

        // 3. Vérifier les quantités
        for (const line of lines) {
            if (!Number.isInteger(line.qty) || line.qty <= 0) {
                throw new Error(
                    'La quantité doit être un entier supérieur à 0'
                );
            }
        }

        // Enregistrer les champs
        this.id = id;
        this.customerId = customerId;
        this.#lines = lines.map(line => ({ ...line }));
        this.createdAt = createdAt;
    }

    // Retourne une copie pour empêcher la modification externe
    get lines() {
        return this.#lines.map(line => ({ ...line }));
    }

    get statut() {
        return this.#statut;
    }

    get total() {
        return this.#lines.reduce(
            (somme, line) => somme + line.qty * line.unitPrice,
            0
        );
    }

    get motif() {
        return this.#motif;
    }

    marquerPayee() {
        if (this.#statut !== 'EN_ATTENTE') {
            throw new Error('Commande déjà traitée');
        }

        this.#statut = 'PAYEE';
    }

    marquerRefusee(motif) {
        if (this.#statut !== 'EN_ATTENTE') {
            throw new Error('Commande déjà traitée');
        }

        this.#statut = 'REFUSEE';
        this.#motif = motif;
    }

    toJSON() {
        return {
            id: this.id,
            customerId: this.customerId,
            lines: this.lines,
            total: this.total,
            statut: this.statut,
            motif: this.motif,
            createdAt: this.createdAt
        };
    }
}
