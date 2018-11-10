import $ from "jquery";
import view from "./view.html";

class UIBottom {
  constructor() {
    this.selector = "#bottom";
  }

  select() {
    return $(this.selector);
  }

  mount() {
    $("#ui").append(view);
    this.select().on("click", this.downButtonPressed.bind(this));
  }

  downButtonPressed(ev) {
    console.log("you did good kid. keep going");
  }
}

export default { view, ref: new UIBottom() };
