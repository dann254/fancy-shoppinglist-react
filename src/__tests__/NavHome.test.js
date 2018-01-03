import React from "react";
import { shallow, mount, render } from "enzyme";
import ReactDOM from "react-dom";
import { Redirect } from "react-router-dom";
import NavHome from "../Components/Navhome";
import moxios from "moxios";
import * as api from "../Components/API_URLS";

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

describe("Mocking login token and status validation request ", () => {
  beforeEach(function() {
    moxios.install();
    window.localStorage.setItem("token", "token-is-present");
  });
  afterEach(function() {
    moxios.uninstall();
  });
  it("Changes state to redirect when user is logged in", done => {
    const navComponent = mount(<NavHome />);
    navComponent.instance().getUser();
    moxios.stubRequest(api.userEp, {
      status: 200
    });
    moxios.wait(function() {
      // Expect state of isLoading changes
      expect(navComponent.instance().state.logged_in).toBe(true);
      done();
    });
  });
});
