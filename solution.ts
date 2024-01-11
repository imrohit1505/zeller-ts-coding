type PricingRule = (sku: string, count: number) => number;

class Checkout {
  private cart: string[] = [];
  private pricingRules: { [sku: string]: PricingRule };

  constructor(pricingRules: { [sku: string]: PricingRule }) {
    this.pricingRules = pricingRules;
  }

  scan(item: string): void {
    this.cart.push(item);
  }

  total(): number {
    const itemCounts = this.getCounts();
    let totalPrice = 0;

    for (const sku in itemCounts) {
      if (itemCounts.hasOwnProperty(sku)) {
        const count = itemCounts[sku];
        const price = this.calculatePrice(sku, count);
        totalPrice += price;
      }
    }

    return totalPrice;
  }

  private getCounts(): { [sku: string]: number } {
    return this.cart.reduce((counts, sku) => {
      counts[sku] = (counts[sku] || 0) + 1;
      return counts;
    }, {});
  }

  private calculatePrice(sku: string, count: number): number {
    const pricingRule = this.pricingRules[sku];
    if (pricingRule) {
      return pricingRule(sku, count);
    } else {
      // Default pricing if no special rule
      const standardPrice = this.getStandardPrice(sku);
      return standardPrice * count;
    }
  }

  private getStandardPrice(sku: string): number {
    const standardPrices: { [sku: string]: number } = {
      ipd: 549.99,
      mbp: 1399.99,
      atv: 109.50,
      vga: 30.00,
    };

    return standardPrices[sku] || 0;
  }
}

// Example pricing rules
const pricingRules: { [sku: string]: PricingRule } = {
  atv: (sku, count) => {
    // 3 for 2 deal on Apple TVs
    return (Math.floor(count / 3) * 2 + count % 3) * 109.50;
  },
  ipd: (sku, count) => {
    // Bulk discount for Super iPad
    return count > 4 ? 499.99 : 549.99;
  },
};

// Example usage
const co = new Checkout(pricingRules);
co.scan('ipd');
co.scan('mbp');
co.scan('atv');
co.scan('atv');
co.scan('atv');
co.scan('vga');
console.log(co.total()); 
