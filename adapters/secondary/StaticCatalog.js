
export class StaticCatalog {
  constructor() {
    this.products = new Map([
      ['CLAVIER', 49],
      ['SOURIS', 19],
      ['ECRAN', 299]
    ]);
  }

  priceOf(sku) {
    return this.products.get(sku);
  }
}
