import React from "react";
import { shallow, mount, render } from "enzyme";
import ReactDOM from "react-dom";
import { Redirect, Router } from "react-router-dom";
import ForgotPassword from "../Components/Forgotpassword";
import sinon from "sinon";
import moxios from "moxios";
import * as api from "../Components/API_URLS";

describe("test ForgotPassword components", () => {
  it("Renders Form by default correctly", () => {
    const passF = shallow(<ForgotPassword />);
    const passForm = passF.find(".form");
    expect(passForm).toHaveLength(1);
    // Check that a container is the first div
    const container = passF.first("div");
    expect(container).toHaveLength(1);
  });
  describe("Mocking axios request ", () => {
    beforeEach(function() {
      moxios.install();
    });
    afterEach(function() {
      moxios.uninstall();
    });
    it("sends request successfully", () => {
      const passF = mount(<ForgotPassword />);
      passF.instance().sendRequest("email");
      moxios.stubRequest(api.forgotEp, {
        status: 200,
        response: {
          message: "success"
        }
      });
      moxios.wait(function() {
        // Expect toast has success message
        expect(passF.instance().state.success).toBe(true);
        expect(passF.find("ToastContainer").text()).toContain("success");
        done();
      });
    });
    it("Raises error when email", () => {
      const forgot = mount(<ForgotPassword />);
      forgot.instance().sendRequest("");
      moxios.stubRequest(api.forgotEp, {
        status: 401,
        response: { message: "fail" }
      });

      moxios.wait(function() {
        // Expect toast has error message
        expect(forgot.instance().state.submitted).toEqual(false);
        expect(forgot.find("ToastContainer").text()).toContain("fail");
        done();
      });
    });
    it("Shows success page when request is complete", () => {
      const forgot = shallow(<ForgotPassword />);
      forgot.setState({ success: true });
      expect(forgot.find(".f-success")).toHaveLength(1);
    });
    it("Shows loading when request is not complete", () => {
      const forgot = shallow(<ForgotPassword />);
      forgot.setState({ submitted: true });
      expect(forgot.find(".fa-spin")).toHaveLength(1);
    });
  });
});
