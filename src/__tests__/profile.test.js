import React from "react";
import { shallow, mount, render } from "enzyme";
import ReactDOM from "react-dom";
import { Redirect, Router } from "react-router-dom";
import Profile from "../Components/profile";
import * as api from "../Components/API_URLS";
import sinon from "sinon";
import moxios from "moxios";

let parentUrl;
let ProfileComponent;

describe("profile component test cases", () => {
  beforeEach(function() {
    moxios.install();
    parentUrl = {
      url: api.userEp
    };
    ProfileComponent = shallow(<Profile match={parentUrl} />);
  });
  afterEach(function() {
    moxios.uninstall();
  });
  it("Renders Profile component", () => {
    moxios.stubRequest(parentUrl.url, {
      status: 200
    });
    expect(ProfileComponent.length).toEqual(1);
  });
  it("Changes state when getUser is called", () => {
    ProfileComponent.instance().getUser();
    moxios.stubRequest(parentUrl.url, {
      status: 200
    });
    moxios.wait(function() {
      expect(ProfileComponent.instance().state.success).toBe(true);
      done();
    });
  });
  it("Changes state when delete request is called", () => {
    ProfileComponent.instance().deleteHandler();
    moxios.stubRequest(parentUrl.url, {
      status: 200
    });
    moxios.wait(function() {
      expect(ProfileComponent.instance().state.redirect).toBe(true);
      done();
    });
  });
  it("Changes state whenemail is edited", () => {
    ProfileComponent.instance().sendRequest("email");
    moxios.stubRequest(parentUrl.url, {
      status: 200,
      response: ["success"]
    });
    moxios.wait(function() {
      expect(resendComponent.find("ToastContainer").text()).toContain(
        "success"
      );
      done();
    });
  });
  it("Redirects when redirect true", () => {
    const profile = shallow(<Profile />);
    profile.setState({ redirect: true });
    expect(profile.find(Redirect)).toHaveLength(1);
  });
  it("Shows loading when request is not complete", () => {
    const profile = shallow(<Profile />);
    profile.setState({ username: "", success: "" });
    expect(profile.find(".spanel-item-loading")).toHaveLength(1);
  });
  it("shows modal when edit username is clicked", () => {
    const profile = shallow(<Profile />);
    const button = profile.find("a").first();
    button.simulate("click");
    expect(profile.find(".modal-title")).toHaveLength(3);
  });
});
