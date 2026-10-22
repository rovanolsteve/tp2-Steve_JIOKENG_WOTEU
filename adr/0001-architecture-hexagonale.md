# ADR-0001 : Adopter une architecture hexagonale

- Date : 2026-10-21
- Statut : Accepté
- Décideurs : Équipe projet

## Contexte
Le paiement et le stockage sont aujourd'hui des dépendances techniques qui pourront évoluer : un véritable prestataire de paiement devra être intégré ultérieurement et la base de données pourra migrer vers PostgreSQL. Le cœur métier doit donc rester indépendant de ces choix afin de permettre leur remplacement sans réécrire la logique applicative.

## Décision
Nous adoptons une architecture hexagonale : le cœur métier définit des ports et les adaptateurs techniques les implémentent pour le paiement et le stockage. Les prestataires et technologies pourront ainsi être remplacés sans modifier le cœur métier.

## Conséquences
- (+) Le métier reste indépendant des fournisseurs de paiement et de la technologie de stockage.
- (+) Il est possible de remplacer les adaptateurs et de tester le cœur métier avec des doublures, sans dépendre des services externes.
- (+) La règle d'architecture interdit au domaine d'importer les adaptateurs : elle protège le sens des dépendances et garantit que le cœur métier reste indépendant de l'infrastructure.
- (-) L'ajout de ports et d'adaptateurs demande davantage de structure et de code qu'un accès direct aux services techniques.
- (-) Les interfaces doivent être conçues et maintenues avec soin pour éviter une abstraction inutile ou des contrats qui ne correspondent pas aux besoins réels.

## Alternatives considérées
- Architecture en couches avec accès direct aux services techniques depuis la couche métier : rejetée, car elle couplerait la logique métier aux fournisseurs et technologies actuels, rendant leur remplacement plus coûteux.
