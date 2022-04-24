import { templates } from '../settings.js';

class Home{
  constructor(element){
    const thisHome = this;

    thisHome.render(element);
    thisHome.initWidget();
  }

  render(element) {
    const thisHome = this;

    const generatedHTML = templates.homePage();

    thisHome.dom = {};

    thisHome.dom.wrapper = element;

    thisHome.dom.wrapper.innerHTML = generatedHTML;

    console.log('host:', window.location.hostname);

  }

  initWidget() {
    const thisHome = this;

  }
}

export default Home;