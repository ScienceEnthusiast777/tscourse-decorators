//decorators often use uppercase starting characters but you do not have to
//decorator factories
function Logger(logString: string) {
  return function (targetCtor: Function) {
    console.log(logString + targetCtor);
  };
}

//this returns a class that extends the original class and so there is behaviour that executes when the class is instantiated
function WithTemplate(template: string, hookId: string) {
  //you can use an _ for when you need to have an arg but you know that you wont use it

  return function <T extends { new (...any: any[]): { name: string } }>(
    origConstructor: T
  ) {
    return class extends origConstructor {
      constructor(..._: any[]) {
        super();
        console.log("rendering template");
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector("h1")!.textContent = this.name;
        }
      }
    };
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

//Method Decorator
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

const prod1 = new Product("book", 12);

function AutoBind(
  _: any,
  _2: string | Symbol | number,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

class Printer {
  message = "this is working";
  @AutoBind
  showMessage() {
    console.log(this.message);
  }
}
const p = new Printer();
const button = document.querySelector("button")!;
//this will cause the log to show undefined because in the event listener the this keyword is bound to something else
button.addEventListener("click", p.showMessage);
//this could be solved with binding this
// button.addEventListener("click", p.showMessage.bind(p));

//this could also be solved using a decorator (see above AutoBind)

interface ValidatorConfig {
  [property: string]: {
    [validatableProp: string]: string[];
  };
}

const regiseredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
  regiseredValidators[target.constructor.name] = {
    ...regiseredValidators[target.constructor.name],
    [propName]: ["required"],
  };
}

function PositiveNumber(target: any, propName: string) {
  regiseredValidators[target.constructor.name] = {
    ...regiseredValidators[target.constructor.name],
    [propName]: ["positive"],
  };
}

function Validate(obj: any) {
  let isValid = true;
  const objValidators = regiseredValidators[obj.constructor.name];
  if (!objValidators) {
    return true;
  }
  for (const prop in objValidators) {
    console.log(prop);
    for (const validator of objValidators[prop]) {
      switch (validator) {
        case "required":
          isValid = isValid && !!obj[prop];
          break;
        case "positive":
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}

class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseform = document.querySelector("form");
courseform?.addEventListener("submit", (event) => {
  event.preventDefault();
  const titleEl = document.getElementById("title") as HTMLInputElement;
  const priceEl = document.getElementById("price") as HTMLInputElement;
  const title = titleEl.value;
  const price = +priceEl.value;
  const createdCourse = new Course(title, price);
  if (!Validate(createdCourse)) {
    alert("WRONGGG!!!!");
    return;
  }
  console.log(createdCourse);
});
