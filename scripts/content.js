const emailUrlList = [/.+?mail\.google\.com\/mail\/.+?\/.+?\/#.+?\/.*/, /.+?mail\.google\.com\/mail\/.+?\/.+?\/\?ui=.*\&search\=.*\&cvid=\d*/];
const targetNode = document.body;
const config = { attributes: false, childList: true, subtree: false};
var called = false;

const callback = (mutationList, observer) => {
  let hrefUpdated = false;
  let matchUrl = false;

  //Check if childlist has been modified
  for (const mutation of mutationList) {
    if (mutation.type === 'childList') {
      hrefUpdated = true;
    }
  }

  //Check if the url has been modified by ajax
  for (const emailUrl of emailUrlList){
    if(emailUrl.test(window.location.toString())){
      matchUrl = true;
    }
  }

  //Add or remove email result block
  if(matchUrl && hrefUpdated && !called){
    addResultBlock();
    called = true;
  }
  else if(!matchUrl && called){
    removeResultBlock();
    called = false;
  }
};

//Append new node
function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};

//create new node
function createNode(elName, elId, elClass, elContent){
  var el = document.createElement(elName);

  //Add param and content for new node
  if (elId !== undefined){
    el.id = elId;
  }
  if (elClass !== undefined){
    for (let i = 0; i < elClass.length; i += 1){
      el.classList.add(elClass[i]);
    }
  }
  if (elContent !== undefined){
    el.innerHTML = elContent;
  }

  return el;
};

//Create result block
function addResultBlock(){
  //email result block
  var el = createNode("div", "emailResult", undefined, undefined)
  insertAfter(document.getElementById(":4"), el);

  //Block content
  var titleNode = createNode("h3", undefined, undefined, "Results: Suspicious");
  var titleSpan = createNode("span", undefined, ["titleSpan"], undefined)
  var titleButton = createNode("button", "resultButton", undefined, "Click here for more info")

  titleSpan.appendChild(titleButton)
  titleNode.appendChild(titleSpan)
  document.getElementById('emailResult').appendChild(titleNode);
};

//Remove result block
function removeResultBlock(){
  document.getElementById("emailResult").remove();
};

var observer = new MutationObserver(callback);
observer.observe(targetNode, config);