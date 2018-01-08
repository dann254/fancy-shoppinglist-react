import React from "react";
import { shallow, mount, render } from "enzyme";
import { Redirect } from "react-router-dom";
import ReactDOM from "react-dom";
import VerifyEmail from "../Components/Verify";
import moxios from "moxios";
import sinon from "sinon";
import * as api from "../Components/API_URLS";

describe("Reset Password Api request test case", () => {
  let parentUrl;
  let basicUrl = { params: { token: "token" } };
  beforeEach(function() {
    moxios.install();
    parentUrl = {
      url: api.verifyEp + "token"
    };
  });
  afterEach(function() {
    moxios.uninstall();
  });
  it("Verify email successfully", () => {
    const verifyComponent = mount(<VerifyEmail match={basicUrl} />);
    verifyComponent.setState({ success: false, failure: false });
    verifyComponent.instance().emailVerify("token");
    moxios.stubRequest(parentUrl.url, {
      status: 200,
      response: {
        message: "Success"
      }
    });
    moxios.wait(function() {
      // Test state changes
      expect(verifyComponent.instance().state.success).toBe(true);
      done();
    });
  });
  it("Show invalid email and prompt resend if request fails", () => {
    const verifyComponent = mount(<VerifyEmail match={basicUrl} />);
    verifyComponent.setState({ message: "Invalid token.", failure: true });
    expect(verifyComponent.find(".f-success")).toHaveLength(1);
  });
});
