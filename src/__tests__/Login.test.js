import React from "react";
import { shallow, mount, render } from "enzyme";
import ReactDOM from "react-dom";
import { Redirect, Router } from "react-router-dom";
import Login from "../Components/Login";
import sinon from "sinon";
import moxios from "moxios";
import * as api from "../Components/API_URLS";

describe("<Login/> components", () => {
  it("Renders Form by default correctly", () => {
    const loginF = shallow(<Login />);
    const loginForm = loginF.find(".form");
    expect(loginForm).toHaveLength(1);
    // Check that a container is the first div
    const container = loginF.first("div");
    expect(container).toHaveLength(1);
  });
  describe("Mocking axios request to login ", () => {
    beforeEach(function() {
      moxios.install();
    });
    afterEach(function() {
      moxios.uninstall();
    });
    it("Logins in a user successfully", () => {
      const loginF = mount(<Login />);
      loginF.instance().sendRequest("sam", "passamword");
      moxios.stubRequest(api.loginEp, {
        status: 200,
        response: {
          access_token: "2rdwsdfsf",
          message: "login success"
        }
      });
      moxios.wait(function() {
        // Expect toast has success message
        expect(loginF.instance().state.redirect).toBe(true);
        expect(loginF.find("ToastContainer").text()).toContain("login success");
        done();
      });
    });
    it("Raises error when password is not submited", () => {
      const login = mount(<Login />);
      login.instance().sendRequest("sam", "");
      moxios.stubRequest(api.loginEp, {
        status: 401,
        response: { message: "please enter all the required fields" }
      });

      moxios.wait(function() {
        // Expect toast has error message
        expect(login.instance().state.failure).toEqual(true);
        expect(login.find("ToastContainer").text()).toContain(
          "please enter all the required fields"
        );
        done();
      });
    });
    it("Redirects when redirect true", () => {
      const login = shallow(<Login />);
      login.setState({ redirect: true });
      expect(login.find(Redirect)).toHaveLength(1);
    });
    it("Changes state when form is submitted", () => {
      const login = shallow(<Login />);
      login.setState({ username: "sam", password: "casased" });
      const loginForm = login.find("form");
      loginForm.simulate("submit", { preventDefault() {} });
      expect(login.state().redirect).toBe(false);
    });
    // it("Calls sendRequest when form is submitted ", () => {
    //   sinon.spy(Login.prototype, "handleSubmit");
    //   const wrapper = shallow(<Login />);
    //   wrapper.setState({ username: "sam", password: "sasasdsc4" });
    //   const pageForm = wrapper.find("form");
    //   pageForm.simulate("submit", { preventDefault() {} });
    //   expect(Login.prototype.handleSubmit.calledOnce).toEqual(true);
    // });
    //   it("Calls handleSubmit when form is submitted ", () => {
    //     sinon.spy(Login.prototype, "handelsubmit");
    //     const wrapper = shallow(<Login />);
    //     wrapper.setState({ email: "chris@gmail.com", password: "maina1234" });
    //     const pageForm = wrapper.find("Form");
    //     pageForm.simulate("submit", { preventDefault() {} });
    //     expect(Login.prototype.handelsubmit.calledOnce).toEqual(true);
    //   });
    //   it("Changes email state when on change event is called", () => {
    //     const login = shallow(<Login />);
    //     const inputEmail = login.find("Input[name='email']");
    //     const event = {
    //       target: {
    //         name: "email",
    //         value: "chris@gmail.com"
    //       },
    //       preventDefault: () => {
    //         return true;
    //       }
    //     };
    //     inputEmail.simulate("change", event);
    //     expect(login.state().email).toBe(event.target.value);
    //   });
  });
});
