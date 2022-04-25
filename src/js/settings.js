export const select = {
  templateOf: {
    menuProduct: '#template-menu-product',
    cartProduct: '#template-cart-product',
    bookingWidget: '#template-booking-widget',
    homePage: '#template-home-page',
  },
  containerOf: {
    menu: '#product-list',
    cart: '#cart',
    pages: '#pages',
    booking: '.booking-wrapper',
    home: '.home-page',
  },
  all: {
    menuProducts: '#product-list > .product',
    menuProductsActive: '#product-list > .product.active',
    formInputs: 'input, select',
  },
  menuProduct: {
    clickable: '.product__header',
    form: '.product__order',
    priceElem: '.product__total-price .price',
    imageWrapper: '.product__images',
    amountWidget: '.widget-amount',
    cartButton: '[href="#add-to-cart"]',
  },
  widgets: {
    amount: {
      input: 'input.amount',
      linkDecrease: 'a[href="#less"]',
      linkIncrease: 'a[href="#more"]',
    },
    datePicker: {
      wrapper: '.date-picker',
      input: `input[name="date"]`,
    },
    hourPicker: {
      wrapper: '.hour-picker',
      input: 'input[type="range"]',
      output: '.output',
    },
    homeCarousel: {
      wrapper: '.carousel',
    },
  },
  booking: {
    peopleAmount: '.people-amount',
    peopleInput: 'input[name="people"]',
    hoursAmount: '.hours-amount',
    hoursInput: 'input[name="hours"]',
    tablesAll: '.floor-plan',
    tables: '.floor-plan .table',
    starters: '.starters',
  },
  nav: {
    links: '.main-nav a',
  },
  cart: {
    productList: '.cart__order-summary',
    toggleTrigger: '.cart__summary',
    totalNumber: `.cart__total-number`,
    totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
    subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
    deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
    form: '.cart__order',
    formSubmit: '.cart__order [type="submit"]',
    phone: '[name="phone"]',
    address: '[name="address"]',
  },
  cartProduct: {
    amountWidget: '.widget-amount',
    price: '.cart__product-price',
    edit: '[href="#edit"]',
    remove: '[href="#remove"]',
  },
  homePage: {
    linkOrder: '.go-order',
    linkBooking: '.go-booking',
  },
};

export const classNames = {
  menuProduct: {
    wrapperActive: 'active',
    imageVisible: 'active',
  },
  cart: {
    wrapperActive: 'active',
  },
  booking: {
    loading: 'loading',
    table: 'table',
    tableBooked: 'booked',
    tableSelected: 'selected',
  },
  nav: {
    active: 'active',
  },
  pages: {
    active: 'active',
  }
};

export const settings = {
  amountWidget: {
    defaultValue: 1,
    defaultMin: 0,
    defaultMax: 10,
  },
  cart: {
    defaultDeliveryFee: 20,
  },
  hours: {
    open: 12,
    close: 24,
  },
  datePicker: {
    maxDaysInFuture: 14,
  },
  booking: {
    tableIdAttribute: 'data-table',
  },
  db: {
    // url: '//localhost:3131',
    url: '//' + window.location.hostname + (window.location.hostname == '127.0.0.1' ? ':3131' : ''),
    products: 'products',
    orders: 'orders',
    booking: 'bookings',
    event: 'events',
    dateStartParamKey: 'date_gte',
    dateEndParamKey: 'date_lte',
    notRepeatParam: 'repeat=false',
    repeatParam: 'repeat_ne=false',
  },
  homeCarousel: [
    {
      src: '../assets/pizza-1.jpg',
      alt: 'Zdjęcie nr 1',
      title: 'Amazing!',
      txt: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quam fugit excepturi nisi quo sit amet consectetur adipisicing.',
      who: 'Margaret Osborne',
    },
    {
      src: '../assets/pizza-2.jpg',
      alt: 'Zdjęcie nr 2',
      title: 'Super!',
      txt: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quam fugit excepturi nisi quo fugit excepturi nisi quo sit. sit amet consectetur adipisicing elit.',
      who: 'John Smith',
    },
    {
      src: '../assets/pizza-3.jpg',
      alt: 'Zdjęcie nr 3',
      title: 'Cool!',
      txt: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quam fugit excepturi nisi quo',
      who: 'Adam Doe',
    },
  ],
  homeGallery: [
    {
      src: '/assets/pizza-4.jpg',
      alt: 'Zdjęcie nr 1',
    },
    {
      src: '/assets/pizza-5.jpg',
      alt: 'Zdjęcie nr 2',
    },
    {
      src: '/assets/pizza-6.jpg',
      alt: 'Zdjęcie nr 3',
    },
    {
      src: '/assets/pizza-7.jpg',
      alt: 'Zdjęcie nr 4',
    },
    {
      src: '/assets/pizza-8.jpg',
      alt: 'Zdjęcie nr 5',
    },
    {
      src: '/assets/pizza-9.jpg',
      alt: 'Zdjęcie nr 6',
    },
  ],
  homeInfoTop: {
    src1: '../assets/pizza-1.jpg',
    alt1: 'Opis 1',
    src2: '../assets/pizza-2.jpg',
    alt2: 'Opis 2',
  },
};

export const templates = {
  menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
  bookingWidget: Handlebars.compile(document.querySelector(select.templateOf.bookingWidget).innerHTML),
  homePage: Handlebars.compile(document.querySelector(select.templateOf.homePage).innerHTML),
};