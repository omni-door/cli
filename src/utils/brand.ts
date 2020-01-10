export const LOGO = '🐸  ';
export const BRAND = `${LOGO}[OMNI-DOOR]:`;

class Brand {
  private brand: string;

  constructor () {
    this.brand = BRAND;
  }

  setBrand (brand: string) {
    this.brand = brand || BRAND;
  }

  getBrand () {
    return this.brand;
  }
}

const brand = new Brand();

export const setBrand = brand.setBrand;
export default brand.getBrand;