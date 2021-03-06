// console.clear();

import { settings, select, classNames } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import Home from './components/Home.js';

const app = {
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    
    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for (const page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }
    
    thisApp.activatePage(pageMatchingHash);

    for (const link of thisApp.navLinks) {
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        // * get page id from href attribute
        const id = clickedElement.getAttribute('href').replace('#', '');

        // * run thisApp.activatePage with that id
        thisApp.activatePage(id);

        // * change URL hash
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId){
    const thisApp = this;

    // * add class "active" to maching pages, remove from non-matching
    for (const page of thisApp.pages) {
      // zmieni z uwzględnieniem warunku
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    
    // * add class "active" to maching links, remove from non-matching
    for (const link of thisApp.navLinks) {
      // zmieni z uwzględnieniem warunku
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageId
      );
    }
    
  },

  initHome: function () {
    const thisApp = this;
    thisApp.home = new Home(document.querySelector(select.containerOf.home));
    
    thisApp.home.dom.linkOrder.addEventListener('click', function (event) {
      event.preventDefault();
      thisApp.activatePage('order');
    });
    thisApp.home.dom.linkBooking.addEventListener('click', function (event) {
      event.preventDefault();
      thisApp.activatePage('booking');
    });
  },

  initBooking: function(){
    this.booking = new Booking(document.querySelector(select.containerOf.booking));
  },

  initData: function(){
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.products;

    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        // console.log('parsedResponse:', parsedResponse);
        thisApp.data.products = parsedResponse;
        thisApp.initMenu();
      });
    // console.log('thisApp.data',JSON.stringify(thisApp.data));
  },

  initMenu: function(){
    const thisApp = this;

    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },

  init: function(){
    const thisApp = this;

    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
    thisApp.initHome();
  }
};

app.init();