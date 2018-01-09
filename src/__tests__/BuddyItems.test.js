import React from "react";
import { shallow, mount, render } from "enzyme";
import { Redirect } from "react-router-dom";
import ReactDOM from "react-dom";
import BuddyItems from "../Components/BuddyItems";
import moxios from "moxios";
import sinon from "sinon";
import * as api from "../Components/API_URLS";

let parentUrl;
let SviewComponent;
let basicUrl = { params: { id: 1 } };

describe("sview component test cases", () => {
  beforeEach(function() {
    moxios.install();
    parentUrl = {
      url: api.buddiesListsEP + 1
    };
    SviewComponent = shallow(<BuddyItems match={basicUrl} />);
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
