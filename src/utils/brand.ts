export const LOGO = '🐸  ';
export const BRAND = `${LOGO}[OMNI-DOOR]:`;

class Brand {
  private brand: string;

  constructor () {
    this.brand = BRAND;
    this.setBrand = this.setBrand.bind(this);
    this.getBrand = this.getBrand.bind(this);
  }

  setBrand (brand: string) {
    this.brand = brand || BRAND;
  }

  getBrand () {
    return this.brand || BRAND;
  }
}

const brand = new Brand();

export const setBrand = brand.setBrand;
export default brand.getBrand;