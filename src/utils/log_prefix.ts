export const LOGO = '🐸  ';
export const BRAND = 'OMNI-DOOR';

class Brand {
  private logo: string;
  private brand: string;

  constructor () {
    this.logo = LOGO;
    this.brand = BRAND;
    this.setLogo = this.setLogo.bind(this);
    this.getLogo = this.getLogo.bind(this);
    this.setBrand = this.setBrand.bind(this);
    this.getBrand = this.getBrand.bind(this);
    this.getLogPrefix = this.getLogPrefix.bind(this);
  }

  public setLogo (logo: string) {
    this.logo = logo || LOGO;
  }

  public getLogo () {
    return this.logo || LOGO;
  }

  public setBrand (brand: string) {
    this.brand = brand || BRAND;
  }

  public getBrand () {
    return this.brand || BRAND;
  }

  public getLogPrefix () {
    return (this.logo || LOGO) + '[' + (this.brand || BRAND) + ']:';
  }
}

const brand = new Brand();

export const setLogo = brand.setLogo;
export const getLogo = brand.getLogo;
export const setBrand = brand.setBrand;
export const getBrand = brand.getBrand;

export default brand.getLogPrefix;