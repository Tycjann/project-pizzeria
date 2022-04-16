import { select, templates, classNames } from '../settings.js';
import { utils } from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product {
  constructor(id, data) {
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
  }

  renderInMenu() {
    const thisProduct = this;

    // * generate HTML based on template
    const generateHTML = templates.menuProduct(thisProduct.data);

    // * create element using utils.createElementFromHTML
    thisProduct.element = utils.createDOMFromHTML(generateHTML);

    // * find menu container
    const menuContainer = document.querySelector(select.containerOf.menu);

    // * add element to menu
    menuContainer.appendChild(thisProduct.element);
  }

  getElements() {
    const thisProduct = this;

    thisProduct.dom = {};

    thisProduct.dom.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.dom.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.dom.formInputs = thisProduct.dom.form.querySelectorAll(select.all.formInputs);
    thisProduct.dom.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.dom.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.dom.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.dom.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion() {
    const thisProduct = this;

    // * find the clickable trigger (the element that should react to clicking)
    // thisProduct.dom.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);

    // * START: add event listener to clickable trigger on event click
    thisProduct.dom.accordionTrigger.addEventListener('click', function (event) {

      // * prevent default action for event
      event.preventDefault();

      // * find active product (product that has active class)
      const activeProdukt = document.querySelector(select.all.menuProductsActive);

      // * if there is active product and it's not thisProduct.element, remove class active from it
      if (activeProdukt && (thisProduct.element != activeProdukt)) {
        activeProdukt.classList.remove(classNames.menuProduct.wrapperActive);
      }
      // * toggle active class on thisProduct.element
      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
    });
  }

  initOrderForm() {
    const thisProduct = this;

    thisProduct.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.dom.formInputs) {
      input.addEventListener('change', function () {
        thisProduct.processOrder();
      });
    }

    thisProduct.dom.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder() {
    const thisProduct = this;

    // * covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
    const formData = utils.serializeFormToObject(thisProduct.dom.form);

    // * set price to default price
    let price = thisProduct.data.price;

    // * for every category (param)...
    for (let paramId in thisProduct.data.params) {
      // * determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];
      // * console.log('param:', paramId);

      // * for every option in this category
      for (let optionId in param.options) {
        // * determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const option = param.options[optionId];
        // console.log(optionId, option);

        // * formData[toppings] && formData[toppings].include('olives') 
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        if (optionSelected) {
          // * check if the option is not default
          /* !option.default */
          if (option.default != true) {
            // * add option price to price variable
            price += option.price;
          }
        }
        else {
          // c* heck if the option is default
          if (option.default == true) {
            // * reduce price variable
            price -= option.price;
          }
        }

        // const optionImage = thisProduct.dom.imageWrapper.querySelector(`.${paramId}-${optionId}`);
        const optionImage = thisProduct.dom.imageWrapper.querySelector('.' + paramId + '-' + optionId);

        if (optionImage != null) {

          if (optionSelected) {
            if (option.default == true) {
              optionImage.classList.add('active');
            }
            else {
              if (optionSelected) optionImage.classList.add('active');
              else optionImage.classList.remove('active');
            }
          }
          else optionImage.classList.remove('active');
        }
      }
    }
    // update calculated price in the HTML
    thisProduct.priceSingle = price;

    price *= thisProduct.amountWidget.value;

    thisProduct.dom.priceElem.innerHTML = price;
  }

  initAmountWidget() {
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.dom.amountWidgetElem);

    thisProduct.dom.amountWidgetElem.addEventListener('updated', function () {
      thisProduct.processOrder();
    });
  }

  addToCart() {
    const thisProduct = this;
    // app.cart.add(thisProduct.prepareCartProduct());

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct.prepareCartProduct(),
      },
    });

    thisProduct.element.dispatchEvent(event);
  }

  prepareCartProduct() {
    const thisProduct = this;

    const productSummary = {};

    productSummary.id = thisProduct.id;
    productSummary.name = thisProduct.data.name;
    productSummary.amount = thisProduct.amountWidget.value;
    productSummary.priceSingle = thisProduct.priceSingle;
    productSummary.price = parseInt(productSummary.amount) * parseInt(productSummary.priceSingle);
    productSummary.params = thisProduct.prepareCartProductParams();

    return productSummary;
  }

  prepareCartProductParams() {
    const thisProduct = this;

    const productParams = {};

    const formData = utils.serializeFormToObject(thisProduct.dom.form);

    for (let paramId in thisProduct.data.params) {
      const param = thisProduct.data.params[paramId];

      productParams[paramId] = {
        label: param.label,
        options: {},
      };

      for (let optionId in param.options) {
        const option = param.options[optionId];
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        if (optionSelected) {
          productParams[paramId].options[optionId] = option.label;
        }
      }
    }
    return productParams;
  }
}

export default Product;