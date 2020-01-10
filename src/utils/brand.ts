export const LOGO = '🐸  ';
export const BRAND = `${LOGO}[OMNI-DOOR]:`;

class Brand {
  public brand: string;

  constructor () {
    this.brand = BRAND;
  }

  setBrand (brand: string) {
    this.brand = brand || BRAND;
  }
}

const brand = new Brand();

export const setBrand = brand.setBrand;
export default brand.brand;