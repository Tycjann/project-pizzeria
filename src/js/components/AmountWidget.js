import { select, settings } from '../settings.js';
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget{
  constructor(element){
    super(element, settings.amountWidget.defaultValue);

    const thisWidget =  this;
    // console.log('this:', this);

    thisWidget.getElements(element);
    // ? to przestało teraz dobrze działać
    // ? muszę dodać do HTML value="1" (<input class="amount" type="text" value="1">)
    // thisWidget.setValue(thisWidget.dom.input.value || settings.amountWidget.defaultValue);

    thisWidget.initAction();
  }

  getElements(){
    const thisWidget = this;

    // thisWidget.dom.wrapper = element;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }

  isValid(value){
    return !isNaN(value)
      && value >= settings.amountWidget.defaultMin 
      && value <= settings.amountWidget.defaultMax;
  }

  renedeValue(){
    const thisWidget = this;
    
    thisWidget.dom.input.value = thisWidget.value;
  }

  initAction(){
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function (){
      // thisWidget.setValue(thisWidget.dom.input.value);
      thisWidget.value = thisWidget.dom.input.value;
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function (){
      thisWidget.setValue(parseInt(thisWidget.dom.input.value) - 1);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function (){
      thisWidget.setValue(parseInt(thisWidget.dom.input.value) + 1);
    });
  }
}

export default AmountWidget;