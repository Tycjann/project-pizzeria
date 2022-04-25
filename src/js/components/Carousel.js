class Carousel {
  constructor(element) {
    const thisCarousel = this;
    thisCarousel.initPlugin(element);
  }

  initPlugin(element) {
    const thisCarousel = this;
    // eslint-disable-next-line no-undef
    thisCarousel.flkty = new Flickity(element, {
      // options
      cellAlign: 'left',
      contain: true,
      autoPlay: true
    });
  }
}

export default Carousel;