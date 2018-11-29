import "nes.css/css/nes.min.css";
import "webpack-jquery-ui/draggable";

import { h, render, Component } from "preact";
/** @jsx h */

import linkState from "linkstate";

import game from "game";

import BottomUI from "./ui/bottom";

import "styles/index.scss";

class App extends Component {
  constructor() {
    super();
    this.state = {
      text: "hello"
    };
  }

  render({}, { text }) {
    return (
      <app>
        <BottomUI />
      </app>
    );
  }
}

// Start 'er up:
render(<App />, document.querySelector("#ui"));
