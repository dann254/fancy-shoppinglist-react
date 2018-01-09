import React from "react";
import { shallow, mount, render } from "enzyme";
import ReactDOM from "react-dom";
import { Redirect, Router } from "react-router-dom";
import Rcon from "../Components/resend_confirmation";
import * as api from "../Components/API_URLS";
import sinon from "sinon";
import moxios from "moxios";

let parentUrl;
let resendComponent;

describe("Rconcomponent test cases", () => {
  it("Renders Rcon component", () => {
    const resendComponent = shallow(<Rcon />);
    expect(resendComponent).toHaveLength(1);
  });
  it("Shows loading as soon as the form is submitted", () => {
    const resend = shallow(<Rcon />);
    resend.setState({ submitted: true });
    expect(resend.find(".fa-spin")).toHaveLength(1);
  });
  it("Shows success page when request passes", () => {
    const resend = shallow(<Rcon />);
    resend.setState({ success: true, submitted: true });
    expect(resend.find(".f-success")).toHaveLength(1);
  });

  beforeEach(function() {
    moxios.install();
    parentUrl = {
      url: api.resendEp
    };
    resendComponent = shallow(<Rcon match={parentUrl} />);
  });
  afterEach(function() {
    moxios.uninstall();
  });
  it("Changes state when sendRequest is called", () => {
    resendComponent.instance().sendRequest("email");
    moxios.stubRequest(parentUrl.url, {
      status: 200,
      response: {
        message: "success"
      }
    });
    moxios.wait(function() {
      expect(resendComponent.instance().state.success).toBe(true);
      expect(resendComponent.find("ToastContainer").text()).toContain(
        "success"
      );
      done();
    });
  });
  it("Changes state when sendRequest fails", () => {
    resendComponent.instance().sendRequest("email");
    moxios.stubRequest(parentUrl.url, {
      status: 401,
      response: {
        message: "fail"
      }
    });
    moxios.wait(function() {
      expect(resendComponent.instance().state.submitted).toBe(false);
      expect(resendComponent.find("ToastContainer").text()).toContain("fail");
      done();
    });
  });
});
