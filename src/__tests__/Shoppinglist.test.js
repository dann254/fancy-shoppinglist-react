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
  it("Changes state when getShoppinglit is called", done => {
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
  it("Creates when addShoppinglit is called", () => {
    ShoppinglistsComponent.instance().sendAddRequest("food");
    moxios.stubRequest(parentUrl.url, {
      status: 200,
      response: {
        name: "food",
        shared: true
      }
    });
    moxios.wait(function() {
      expect(ShoppinglistsComponent.instance().state.addSuccess).toBe(true);
      done();
    });
  });
  it("Shows no shoppinglist when there are no shoppinglists", () => {
    ShoppinglistsComponent.setState({
      shoppinglists: [],
      success: false,
      message: "you dont have any shoppinglists with that name"
    });
    expect(ShoppinglistsComponent.find(".spanel-item-none")).toHaveLength(1);
  });
  it("Shows loading when request is not complete", () => {
    ShoppinglistsComponent.setState({ sucess: false, shoppinglists: [] });
    expect(ShoppinglistsComponent.find(".fa-spin")).toHaveLength(1);
  });
});
