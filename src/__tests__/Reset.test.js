import React from "react";
import { shallow, mount, render } from "enzyme";
import ReactDOM from "react-dom";
import { Redirect, Router } from "react-router-dom";
import ResetPassword from "../Components/Reset";
import * as api from "../Components/API_URLS";
import sinon from "sinon";
import moxios from "moxios";

let parentUrl;
let resetComponent;

describe("Resetcomponent test cases", () => {
  it("Renders Reset component", () => {
    const resetComponent = shallow(<ResetPassword />);
    expect(resetComponent).toHaveLength(1);
  });
  describe("Reset component mock test cases", () => {
    beforeEach(function() {
      moxios.install();
      parentUrl = {
        url: api.resetEp
      };
      resetComponent = shallow(<ResetPassword match={parentUrl} />);
    });
    afterEach(function() {
      moxios.uninstall();
    });
    it("Renders Reset with mocking component", () => {
      moxios.stubRequest(parentUrl.url, {
        status: 200
      });
      expect(resetComponent.length).toEqual(1);
    });
    it("Changes state when resetPassword is called", () => {
      resetComponent.instance().resetPassword("SDdssdsd", "password");
      moxios.stubRequest(parentUrl.url, {
        status: 200,
        response: {
          message: "success"
        }
      });
      moxios.wait(function() {
        expect(resetComponent.instance().state.success).toBe(true);
        expect(resetComponent.find("ToastContainer").text()).toContain(
          "success"
        );
        done();
      });
    });
    it("Changes state when resetPassword is called and fails", () => {
      resetComponent.instance().resetPassword("SDdssdsd", "password");
      moxios.stubRequest(parentUrl.url, {
        status: 401,
        response: {
          message: "failed"
        }
      });
      moxios.wait(function() {
        expect(resetComponent.instance().state.failure).toBe(false);
        expect(resetComponent.find("ToastContainer").text()).toContain(
          "failed"
        );
        done();
      });
    });
    it("Redirects when success is true", () => {
      const reset = shallow(<ResetPassword />);
      reset.setState({ success: true });
      expect(reset.find(Redirect)).toHaveLength(1);
    });
    it("Shows loading as soon as the form is submitted", () => {
      const reset = shallow(<ResetPassword />);
      reset.setState({ submitted: true });
      expect(reset.find(".fa-spin")).toHaveLength(1);
    });
    it("Shows error page when request fails", () => {
      const reset = shallow(<ResetPassword />);
      reset.setState({ message: "Invalid token.", failure: true });
      expect(reset.find(".f-info")).toHaveLength(1);
    });
    // it("calls componentWillMount", () => {
    //   const testMountCall = sinon.spy(
    //     BuddyShoppinglists.prototype,
    //     "componentWillMount"
    //   );
    //   const wrapper = shallow(<BuddyShoppinglists />);
    //   expect(testMountCall.calledOnce).toEqual(true);
    // });
  });
});
