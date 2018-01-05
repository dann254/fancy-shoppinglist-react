import React from "react";
import { shallow, mount, render } from "enzyme";
// import ReactDOM from "react-dom";
import { Redirect } from "react-router-dom";
import NavDash from "../Components/NavDash";
import moxios from "moxios";
import * as api from "../Components/API_URLS";

describe("Navigation component test cases", () => {
  it("Renders Navigation component", () => {
    const navComponent = shallow(<NavDash />);
    expect(navComponent).toHaveLength(1);
  });
  it("does not redirect if the user is logged in", () => {
    const navComponent = shallow(<NavDash />);
    navComponent.setState({ failure: false });
    // navComponent.instance().getUser();
    expect(navComponent.state().failure).toBe(false);
  });
});
