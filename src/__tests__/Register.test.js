import React from "react";
import { shallow, mount, render } from "enzyme";
import ReactDOM from "react-dom";
import { Redirect, Router } from "react-router-dom";
import Register from "../Components/Register";
import sinon from "sinon";
import moxios from "moxios";
import * as api from "../Components/API_URLS";

describe("<Register/> components", () => {
  it("Renders Form by default correctly", () => {
    const registerF = shallow(<Register />);
    const registerForm = registerF.find(".form");
    expect(registerForm).toHaveLength(1);
    // Check that a container is the first div
    const container = registerF.first("div");
    expect(container).toHaveLength(1);
  });
  describe("Mocking axios request to register ", () => {
    beforeEach(function() {
      moxios.install();
    });
    afterEach(function() {
      moxios.uninstall();
    });
    it("Registers a user successfully", () => {
      const registerF = mount(<Register />);
      registerF.instance().sendRequest("sam", "passamword");
      moxios.stubRequest(api.registerEp, {
        status: 200,
        response: {
          access_token: "2rdwsdfsf",
          message: "register success"
        }
      });
      moxios.wait(function() {
        // Expect toast has success message
        expect(registerF.instance().state.redirect).toBe(true);
        expect(registerF.find("ToastContainer").text()).toContain(
          "register success"
        );
        done();
      });
    });
    it("Raises error when password is not submited", () => {
      const register = mount(<Register />);
      register.instance().sendRequest("sam", "");
      moxios.stubRequest(api.registerEp, {
        status: 401,
        response: { message: "please enter all the required fields" }
      });

      moxios.wait(function() {
        // Expect toast has error message
        expect(register.instance().state.failure).toEqual(true);
        expect(register.find("ToastContainer").text()).toContain(
          "please enter all the required fields"
        );
        done();
      });
    });
    it("Redirects when redirect true", () => {
      const register = shallow(<Register />);
      register.setState({ success: true });
      expect(register.find(".f-big")).toHaveLength(1);
    });
    it("Changes state when form is submitted", () => {
      const register = shallow(<Register />);
      register.setState({ username: "sam", password: "casased" });
      const registerForm = register.find("form");
      registerForm.simulate("submit", { preventDefault() {} });
      expect(register.state().success).toBe(false);
    });
  });
});
