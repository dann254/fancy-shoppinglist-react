import React from "react";
import { shallow, mount, render } from "enzyme";
import { Redirect } from "react-router-dom";
import ReactDOM from "react-dom";
import ShoppinglistView from "../Components/shoppinglist_view";
import moxios from "moxios";
import sinon from "sinon";
import * as api from "../Components/API_URLS";

let parentUrl;
let SviewComponent;
let prps = [{ name: "dan", id: 1, shared: true }];

describe("sview component test cases", () => {
  beforeEach(function() {
    moxios.install();
    parentUrl = {
      url: api.shoppinglistsEP + 1
    };
    SviewComponent = shallow(
      <ShoppinglistView match={parentUrl} shoppinglists={prps} />
    );
  });
  afterEach(function() {
    moxios.uninstall();
  });
  it("Renders Shoppinglists component", () => {
    moxios.stubRequest(parentUrl.url, {
      status: 200
    });
    expect(SviewComponent.length).toEqual(1);
  });
  it("Changes state when shoppinglist is edited", () => {
    SviewComponent.instance().sendEditRequest("food", 1);
    moxios.stubRequest(parentUrl.url, {
      status: 200
    });
    moxios.wait(function() {
      expect(ShoppinglistsComponent.instance().state.editSuccess).toBe(true);
      done();
    });
  });
  it("Changes state when shoppinglist deleted", () => {
    SviewComponent.instance().deleteRequest();
    moxios.stubRequest(parentUrl.url, {
      status: 200
    });
    moxios.wait(function() {
      expect(resendComponent.find("ToastContainer").text()).toContain(
        "Shoppinglists deleted"
      );
      done();
    });
  });
  it("Changes state when shoppinglist shared", () => {
    SviewComponent.instance().shareRequest(1);
    moxios.stubRequest(parentUrl.url, {
      status: 200
    });
    moxios.wait(function() {
      expect(resendComponent.find("ToastContainer").text()).toContain(
        "Success"
      );
      done();
    });
  });
});
