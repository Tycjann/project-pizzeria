import { select } from '../settings.js';
import AmountWidget  from './AmountWidget.js';

class CartProduct {
    constructor(menuProduct, element) {
        const thisCartProduct = this;

        thisCartProduct.id = menuProduct.id;
        thisCartProduct.name = menuProduct.name;
        thisCartProduct.amount = menuProduct.amount;
        thisCartProduct.priceSingle = menuProduct.priceSingle;
        thisCartProduct.price = menuProduct.price;
        thisCartProduct.params = menuProduct.params;

        thisCartProduct.getElements(element);
        thisCartProduct.initAmountWidget();
        thisCartProduct.initAction();
        thisCartProduct.getData();
    }

    getElements(element) {
        const thisCartProduct = this;
        thisCartProduct.dom = {};
        thisCartProduct.dom.wrapper = element;

        thisCartProduct.dom.amountWidgetElem = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
        thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
        thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
        thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
    }

    getData() {
        const thisCartProduct = this;

        const cartProductSummary = {
            id: thisCartProduct.id,
            amount: thisCartProduct.amount,
            price: thisCartProduct.price,
            priceSingle: thisCartProduct.priceSingle,
            name: thisCartProduct.name,
            params: thisCartProduct.params,
        };
        return cartProductSummary;
    }

    initAmountWidget() {
        const thisCartProduct = this;

        thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidgetElem);

        thisCartProduct.dom.amountWidgetElem.addEventListener('updated', function () {
            thisCartProduct.price = parseInt(thisCartProduct.priceSingle) * parseInt(thisCartProduct.amountWidget.value);
            thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
        });
    }

    remove() {
        const thisCartProduct = this;

        const event = new CustomEvent('remove', {
            bubbles: true,
            detail: {
                cartProduct: thisCartProduct,
            },
        });
        thisCartProduct.dom.wrapper.dispatchEvent(event);
    }

    initAction() {
        const thisCartProduct = this;

        thisCartProduct.dom.edit.addEventListener('click', function (event) {
            event.preventDefault();
            console.log('click edit');
        });

        thisCartProduct.dom.remove.addEventListener('click', function (event) {
            event.preventDefault();
            thisCartProduct.remove();
        });
    }
}

export default CartProduct;