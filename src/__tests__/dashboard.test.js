import React from "react";
import { shallow, mount, render } from "enzyme";
import ReactDOM from "react-dom";
import { Redirect, Router } from "react-router-dom";
import Dashboard from "../Components/dashboard";
import * as api from "../Components/API_URLS";
import sinon from "sinon";

describe("Dashboard component test cases", () => {
  it("Renders Dashboardcomponent", () => {
    const dashComponent = shallow(<Dashboard />);
    expect(dashComponent).toHaveLength(1);
  });
  describe("Mocking axios request to login ", () => {
    beforeEach(function() {
      window.localStorage.setItem("msg", "success");
    });
    afterEach(function() {});
    it("calls componentDidMount", () => {
      const testMountCall = sinon.spy(Dashboard.prototype, "componentDidMount");
      const wrapper = shallow(<Dashboard />);
      expect(testMountCall.calledOnce).toEqual(true);
    });
  });
});
