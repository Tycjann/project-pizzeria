class BaseWidget{
  constructor(wrapperElement, initialValue){
    this.dom = {};
    this.dom.wrapper = wrapperElement;

    this.correctValue = initialValue; 
  }

  get value(){
    return this.correctValue;
  }

  set value(value){
    const newValue = this.parseValue(value);

    if (this.correctValue != newValue && this.isValid(newValue)) {
      this.correctValue = newValue;
      this.announce();
    }

    this.renderValue();
  }

  setValue(value){
    this.value = value;
  }

  parseValue(value){
    return parseInt(value);
  }

  isValid(value){
    return !isNaN(value);
  }
  
  renderValue() {
    this.dom.wrapper.innerHTML = this.value;
  }

  announce() {
    const event = new CustomEvent('updated', {
      bubbles: true
    });

    this.dom.wrapper.dispatchEvent(event);
  }

}

export default BaseWidget;