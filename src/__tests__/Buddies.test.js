import React from "react";
import { shallow, mount, render } from "enzyme";
import { Redirect } from "react-router-dom";
import Buddies from "../Components/Buddies";
import moxios from "moxios";
import * as api from "../Components/API_URLS";

let parentUrl;
let BuddiesComponent;

describe("Buddies component test cases", () => {
  beforeEach(function() {
    moxios.install();
    parentUrl = {
      url: api.buddiesEP
    };
    BuddiesComponent = shallow(<Buddies match={parentUrl} />);
  });
  afterEach(function() {
    moxios.uninstall();
  });
  it("Renders Buddies component", () => {
    moxios.stubRequest(parentUrl.url, {
      status: 200
    });
    expect(BuddiesComponent.length).toEqual(1);
  });
});
