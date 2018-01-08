import React from "react";
import { shallow, mount, render } from "enzyme";
import { Redirect } from "react-router-dom";
import ReactDOM from "react-dom";
import BuddyShoppinglists from "../Components/Buddy_shoppinglists";
import moxios from "moxios";
import sinon from "sinon";
import * as api from "../Components/API_URLS";

let parentUrl;
let BuddyShoppinglistsComponent;

describe("Buddies component test cases", () => {
  beforeEach(function() {
    moxios.install();
    parentUrl = {
      url: api.buddiesListEP
    };
    BuddyShoppinglistsComponent = shallow(
      <BuddyShoppinglists match={parentUrl} />
    );
  });
  afterEach(function() {
    moxios.uninstall();
  });
  it("Renders BuddyShoppinglists component", () => {
    moxios.stubRequest(parentUrl.url, {
      status: 200
    });
    expect(BuddyShoppinglistsComponent.length).toEqual(1);
  });
  it("Changes state when getBuddyshoppinglists is called", done => {
    BuddyShoppinglistsComponent.instance().getBuddyShoppinglists("");
    moxios.stubRequest(parentUrl.url, {
      status: 200,
      response: {
        name: "food",
        shared: true
      }
    });
    moxios.wait(function() {
      expect(BuddyShoppinglistsComponent.instance().state.success).toBe(true);
      done();
    });
  });

  it("Shows message when there are no shoppinglists", () => {
    BuddyShoppinglistsComponent.setState({
      message: "no shoppinglists",
      success: true
    });
    expect(BuddyShoppinglistsComponent.find(".spanel-item-none")).toHaveLength(
      1
    );
  });
  it("Shows loading when request is not complete", () => {
    BuddyShoppinglistsComponent.setState({
      sucess: false,
      buddyshoppinglists: []
    });
    expect(BuddyShoppinglistsComponent.find(".fa-spin")).toHaveLength(1);
  });
});
