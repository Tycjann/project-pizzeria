import { select, templates, settings } from '../settings.js';
import Carousel from './Carousel.js';

class Home{
  constructor(element){
    const thisHome = this;

    thisHome.render(element);
    thisHome.initWidget();
  }

  render(element) {
    const thisHome = this;

    const generatedHTML = templates.homePage(settings);

    thisHome.dom = {};

    thisHome.dom.wrapper = element;

    thisHome.dom.wrapper.innerHTML = generatedHTML;
    
    thisHome.dom.linkOrder = thisHome.dom.wrapper.querySelector(select.homePage.linkOrder);
    thisHome.dom.linkBooking = thisHome.dom.wrapper.querySelector(select.homePage.linkBooking);
    thisHome.dom.carouselWidget = thisHome.dom.wrapper.querySelector(select.widgets.homeCarousel.wrapper);
  }

  initWidget() {
    const thisHome = this;

    thisHome.carouselWidget = new Carousel(thisHome.dom.carouselWidget);

    // thisHome.dom.linkOrder.addEventListener('click', function (event) {
    //   console.log('thisHome:', thisHome, event);
    // });

  }
}

export default Home;