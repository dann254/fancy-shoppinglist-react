import React from "react";
import { shallow, mount, render } from "enzyme";
import { Redirect } from "react-router-dom";
import ReactDOM from "react-dom";
import ItemView from "../Components/buddy_item_view";
import moxios from "moxios";
import sinon from "sinon";
import * as api from "../Components/API_URLS";

let parentUrl;
let SviewComponent;
let prps = [{ name: "dan", id: 1, price: 4, quantity: 6 }];

describe("sview component test cases", () => {
  beforeEach(function() {
    moxios.install();
    parentUrl = {
      url: api.shoppinglistsEP + 1 + "/items/" + 1
    };
    SviewComponent = shallow(<ItemView match={parentUrl} items={prps} />);
  });
  afterEach(function() {
    moxios.uninstall();
  });
  it("Renders  component", () => {
    moxios.stubRequest(parentUrl.url, {
      status: 200
    });
    expect(SviewComponent.length).toEqual(1);
  });
});
