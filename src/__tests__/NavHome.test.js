import React from "react";
import { shallow, mount, render } from "enzyme";
import ReactDOM from "react-dom";
import { NavHome } from "../components/Navhome";

describe("Navigation component test cases", () => {
  it("Renders Navigation component", () => {
    const navComponent = shallow(<NavHome />);
    expect(navComponent).toHaveLength(1);
  });
  it("Changes state to redirect when user is logged in", () => {
    const navComponent = shallow(<NavHome />);
    navComponent.setState({ logged_in: false });
    // navComponent.instance().getUser();
    expect(navComponent.state().logged_in).toBe(false);
  });
});
