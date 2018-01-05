import React from "react";
import { shallow, mount, render } from "enzyme";
import { Redirect } from "react-router-dom";
import ReactDOM from "react-dom";
import Shoppinglists from "../Components/Shoppinglists";
import moxios from "moxios";
import sinon from "sinon";
import * as api from "../Components/API_URLS";

let parentUrl;
let ShoppinglistsComponent;

describe("Buddies component test cases", () => {
  beforeEach(function() {
    moxios.install();
    parentUrl = {
      url: api.shoppinglistsEP
    };
    ShoppinglistsComponent = shallow(<Shoppinglists match={parentUrl} />);
  });
  afterEach(function() {
    moxios.uninstall();
  });
  it("Renders Shoppinglists component", () => {
    moxios.stubRequest(parentUrl.url, {
      status: 200
    });
    expect(ShoppinglistsComponent.length).toEqual(1);
  });
  it("Changes state when getBuddies is called", done => {
    // const ShoppinglistsComponent = shallow(<ShoppingItemsPage match={parentUrl} />);
    ShoppinglistsComponent.instance().getShoppinglists("");
    moxios.stubRequest(parentUrl.url, {
      status: 200,
      response: {
        name: "food",
        shared: true
      }
    });
    moxios.wait(function() {
      expect(ShoppinglistsComponent.instance().state.success).toBe(true);
      done();
    });
  });
  //
  // it("calls componentWillMount", () => {
  //   const testMountCall = sinon.spy(
  //     Shoppinglists.prototype,
  //     "componentWillMount"
  //   );
  //   const wrapper = shallow(<Shoppinglists />);
  //   expect(testMountCall.calledOnce).toEqual(true);
  // });
});
