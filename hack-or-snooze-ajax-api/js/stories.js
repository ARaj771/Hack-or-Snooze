"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */


function generateStoryMarkup(story, showTrashBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  /*if currentUser is logged in then show favorite/notfavored star
    typecast object currentUser as type Boolean*/

  const renderHeart = Boolean(currentUser);
  

  return $(`
      <li id="${story.storyId}">
       ${showTrashBtn ? getTrashBtn() : ""}
       ${renderHeart ? createHeart(story,currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// submitting a new story from form

async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  //get all the information from the submit form 
  const author = $("#author").val();
  const title = $("#title").val();
  const url = $("#url").val();
  const username = currentUser.username;
  const storyData = {title, url,author, username};

  const story = await storyList.addStory(currentUser,storyData);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  // rest submit form 
  $submitStoryForm.slideUp("slow");
  $submitStoryForm.trigger("reset");
 
}

$submitStoryForm.on("submit",submitNewStory);



/***********Favoriting and unfavoriting a story utilities ************/


function createHeart(story,user){
  const isFavorite = user.isFavorite(story);
  const heartType = isFavorite ? "fas": "far";
  return (`<span class = "heart"> <i class = "${heartType} fa-heart"></i></span>`);
}

// favoriting and unfavoriting a story

async function toggleFav (evt){
  console.debug("toggleFav");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  if($(evt.target).hasClass("fas")){
     await currentUser.remFav(story);
    $(evt.target).closest("i").toggleClass("fas far");
  }
  else{
    await currentUser.addFav(story);
    $(evt.target).closest("i").toggleClass("fas far");
  }
}

$allLists.on("click",".heart", toggleFav);

function putFavOnPage(){
console.debug('putFavOnPage');
$favStories.empty();

if(currentUser.favorites.length === 0) {
  $favStories.append(" Zero favorites ")
} else {
  for(let story of currentUser.favorites){
    const $story = generateStoryMarkup(story);
    $favStories.append($story);
  }
}
$favStories.show();
}

//  Utilites for user's own stories 

function getTrashBtn (){
  return ` <span class = "trash"><i class = "fa fa-trash"></i></span>`;
}

function putMyStoriesOnPage(){
  console.debug("putMyStoriesOnPage");
  $myStories.empty();

  if(currentUser.ownStories.length === 0){
    $myStories.append("No Self Published Stories");
  }else{
    for(let story of currentUser.ownStories){
       let $story = generateStoryMarkup(story,true);
      $myStories.append($story);  
    }
  }
  $myStories.show();
}

// Handle deleting story on trash can click event

async function deleteStory(evt){
  console.debug("deleteStory");

   const $closestLi = $(evt.target).closest("li");
   const storyId = $closestLi.attr("id");
   await storyList.remStory(currentUser, storyId);
   putMyStoriesOnPage();
}
$myStories.on('click', '.trash',deleteStory);

