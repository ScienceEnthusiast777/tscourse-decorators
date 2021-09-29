//decorators often use uppercase starting characters but you do not have to

function Logger(logString: string) {
  return function (targetCtor: Function) {
    console.log(logString + targetCtor);
  };
}

function WithTemplate(template: string, hookId: string) {
  //you can use an _ for when you need to have an arg but you know that you wont use it

  return function (constructor: any) {
    console.log("rendering template");
    const hookEl = document.getElementById(hookId);
    const p = new constructor();
    if (hookEl) {
      hookEl.innerHTML = template;
      console.log(p);
      hookEl.querySelector("h1")!.textContent = p.name;
    }
  };
}

//decorator called when the class is defined
//decorators are exected bottom up
// @Logger("logging...")
@Logger("logging")
@WithTemplate("<h1>WOMBLESSSS</h1>", "app")
class Person {
  name: string = "not yet named";
  constructor() {
    console.log("creating person called : " + this.name);
  }
}

let person: Person = new Person();

//decorator factories

// ----

//different placement of decorator functions

function Log(target: any, propertyName: string) {
  console.log("property decorator");
  console.log(target, propertyName);
}

function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log("Accessing decorator");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

function Log3(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) {
  console.log("Method decorator");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

function Log4(target: any, name: string | Symbol, position: number) {
  console.log("param decorator");
  console.log(target);
  console.log(name);
  console.log(position);
}

class Product {
  @Log
  title: string;
  private _price: number;
  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    }
  }
  constructor(title: string, price: number) {
    this.title = title;
    this._price = price;
  }
  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}
