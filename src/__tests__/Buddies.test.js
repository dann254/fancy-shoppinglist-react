import React from "react";
import { shallow, mount, render } from "enzyme";
import { Redirect } from "react-router-dom";
import ReactDOM from "react-dom";
import Buddies from "../Components/Buddies";
import moxios from "moxios";
import sinon from "sinon";
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
  it("Changes state when getBuddies is called", done => {
    // const BuddiesComponent = shallow(<ShoppingItemsPage match={parentUrl} />);
    BuddiesComponent.instance().getBuddies();
    moxios.stubRequest(parentUrl.url, {
      status: 200,
      response: {
        username: "sam",
        email: "sam@mail.com",
        friend_id: "2",
        shared: "3"
      }
    });
    moxios.wait(function() {
      expect(BuddiesComponent.instance().state.success).toBe(true);
      done();
    });
  });

  it("calls componentWillMount", () => {
    const testMountCall = sinon.spy(Buddies.prototype, "componentWillMount");
    const wrapper = shallow(<Buddies />);
    expect(testMountCall.calledOnce).toEqual(true);
  });

  // it("Invites a buddy", done => {
  //   BuddiesComponent.instance().handleInvite("sam");
  //   moxios.stubRequest(parentUrl.url, {
  //     status: 200,
  //     response: []
  //   });
  //   moxios.wait(function() {
  //     expect(BuddiesComponent.instance().state.success).toBe(true);
  //     done();
  //   });
  // });
  //
  // it("uninvites a buddy", done => {
  //   BuddiesComponent.instance().unfriendHandler(1);
  //   moxios.stubRequest(parentUrl.url, {
  //     status: 200
  //   });
  //   moxios.wait(function() {
  //     expect(BuddiesComponent.find("ToastContainer").text()).toContain(
  //       "Buddy unfriended!"
  //     );
  //     done();
  //   });
  // });

  // it("Returns error when response fails", done => {
  //   BuddiesComponent.instance().handleInvite("sam");
  //   moxios.stubRequest(parentUrl.url, {
  //     status: 401,
  //     response: { message: "friend not added: User does not exist." }
  //   });
  //   moxios.wait(function() {
  //     expect(BuddiesComponent.find("ToastContainer").text()).toContain(
  //       "friend not added: User does not exist."
  //     );
  //     done();
  //   });
  // });
});
