import { select, templates } from '../settings.js';
import AmountWidget from './AmountWidget.js';

class Booking{
  constructor(element){
    this.render(element);
    this.initWidget();
  }

  render(element){

    const generateHTML = templates.bookingWidget();

    this.dom = {};

    this.dom.wraper = element;
    this.dom.wraper.innerHTML = generateHTML;

    this.dom.peopleAmount = this.dom.wraper.querySelector(select.booking.peopleAmount);
    this.dom.hoursAmount = this.dom.wraper.querySelector(select.booking.hoursAmount);
  }

  initWidget(){
    this.peopleAmountWidget = new AmountWidget(this.dom.peopleAmount);
    this.dom.peopleAmount.addEventListener('updated', function(){

    });

    this.hoursAmountWidget = new AmountWidget(this.dom.hoursAmount);
    this.dom.hoursAmount.addEventListener('updated', function () {

    });
  }
}

export default Booking;