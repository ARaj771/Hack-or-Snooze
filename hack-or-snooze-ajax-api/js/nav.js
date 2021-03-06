"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

// show story submit form  on click event

function navSubmitStoryClick(evt) {
  console.debug("navSubmitStoryClick", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitStoryForm.show();
}
$navSubmitStory.on("click", navSubmitStoryClick);

// Utility on clicking nav-bar favorite
function navFavClick(evt) {
  console.debug("navFavClick", evt);
  hidePageComponents();
  putFavOnPage();
}
$favoriteLink.on('click',navFavClick);

// handle click evt on my Stories 

function navMyStoriesClick(evt){
  console.debug('navMyStoriesClick',evt);
  hidePageComponents();
  putMyStoriesOnPage();
  $myStories.show();
}

$myStoriesLink.on("click",navMyStoriesClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
