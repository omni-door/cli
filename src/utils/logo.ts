export const LOGO_DEFAULT = '🐸  [OMNI-DOOR]:';

class Logo {
  public logo: string;

  constructor () {
    this.logo = LOGO_DEFAULT;
  }

  setLogo (logo: string) {
    this.logo = logo || LOGO_DEFAULT;
  }
}

const logo = new Logo();

export const setLogo = logo.setLogo;
export default logo.logo;