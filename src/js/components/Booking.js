import { classNames, select, settings, templates } from '../settings.js';
import { utils } from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.tableSelectId = '';

    thisBooking.starters = [];

    thisBooking.render(element);
    thisBooking.initWidget();
    thisBooking.getData();
    thisBooking.initStarters();
  }

  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePickerWidget.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePickerWidget.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],

      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],

      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking
        + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event
        + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.event
        + '?' + params.eventsRepeat.join('&'),
    };

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponse){
        const bookingResponse = allResponse[0];
        const eventsCurrentResponse = allResponse[1];
        const eventsRepeatResponse = allResponse[2];
        
        return Promise.all([
          bookingResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;
    thisBooking.booked = {};
    
    for (const item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for (const item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePickerWidget.minDate;
    const maxDate = thisBooking.datePickerWidget.maxDate;

    for (const item of eventsRepeat) {
      if (item.repeat == 'daily'){ 
        for (let loopDate = minDate; loopDate < maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.datePickerWidget.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.haurPickerWidget.value);

    let allAvailable = false;

    if (typeof thisBooking.booked[thisBooking.date] == 'undefined'
      || typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }
    
    for (const table of thisBooking.dom.tables) {
      
      table.classList.remove(classNames.booking.tableSelected);
      
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);

      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }

      if (!allAvailable && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  initTables(event){
    const thisBooking = this;
    const selectTable = event.target;

    event.preventDefault();

    if (selectTable.classList.contains(classNames.booking.tableBooked) == false
      && selectTable.classList.contains(classNames.booking.table) == true
    ){
      const selectTableId = selectTable.getAttribute('data-table');

      if (thisBooking.tableSelectId != selectTableId){
        for (const table of thisBooking.dom.tables) {
          table.classList.remove(classNames.booking.tableSelected);
        }
        selectTable.classList.add(classNames.booking.tableSelected);
        thisBooking.tableSelectId = selectTableId;
      } 
      else {
        selectTable.classList.remove(classNames.booking.tableSelected);
        thisBooking.tableSelectId = '';
      }
    }
    else if (selectTable.classList.contains(classNames.booking.table) == true) {
      alert('At this time, the table is full');
    }
  }

  sendBooking(){
    const thisBooking = this;

    const url = settings.db.url + '/' + settings.db.booking;

    if (thisBooking.tableSelectId == '') thisBooking.tableSelectId = null;

    const date = thisBooking.datePickerWidget.value;
    const hour = thisBooking.haurPickerWidget.value;
    const duration = parseInt(thisBooking.dom.hoursAmountInput.value);
    const table = parseInt(thisBooking.tableSelectId);

    thisBooking.makeBooked(date, hour, duration, table);

    const dateSend = {
      'date': date,
      'hour': hour,
      'table': table,
      'duration': duration,
      'ppl': parseInt(thisBooking.dom.peopleAmountInput.value),
      'starters': thisBooking.starters,
      'phone': thisBooking.dom.phone.value,
      'address': thisBooking.dom.address.value,
    };

    const options = {
      body: JSON.stringify(dateSend),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(url, options)
      .then(function (response) {
        return response.json();
      })
      .then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });
  }

  initStarters(){
    const thisBooking = this;

    thisBooking.dom.startersAll.addEventListener('click', function (event) {
      const eventTarget = event.target;

      if (
        eventTarget.tagName == 'INPUT'
        && eventTarget.name == 'starter'
        && eventTarget.type == 'checkbox'
      ) {
        const indexOfId = thisBooking.starters.indexOf(eventTarget.value);
        if (eventTarget.checked) {
          if (indexOfId == -1) thisBooking.starters.push(eventTarget.value);
        }
        else {
          if (indexOfId != -1) thisBooking.starters.splice(indexOfId, 1);
        }
      }
    });
  }

  render(element) {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};

    thisBooking.dom.wrapper = element;
    
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.peopleAmountInput = thisBooking.dom.peopleAmount.querySelector(select.booking.peopleInput);
    
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.hoursAmountInput = thisBooking.dom.hoursAmount.querySelector(select.booking.hoursInput);
    
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    
    thisBooking.dom.tablesAll = thisBooking.dom.wrapper.querySelector(select.booking.tablesAll);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);

    thisBooking.dom.form = document.querySelector(select.cart.form);
    thisBooking.dom.phone = document.querySelector(select.cart.phone);
    thisBooking.dom.address = document.querySelector(select.cart.address);

    thisBooking.dom.startersAll = document.querySelector(select.booking.starters);

  }

  initWidget() {
    const thisBooking = this;

    thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePickerWidget = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.haurPickerWidget = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.tablesAll.addEventListener('click', function(event){
      thisBooking.initTables(event);
    });

    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.tableSelectId = '';
      thisBooking.updateDOM();
    });

    thisBooking.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisBooking.sendBooking();
    });
  }
}

export default Booking;