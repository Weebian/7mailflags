const emailUrlList = [/.+?mail\.google\.com\/mail\/.+?\/.+?\/#.+?\/.*/, /.+?mail\.google\.com\/mail\/.+?\/.+?\/\?ui=.*\&search\=.*\&cvid=\d*/, /.+?mail\.google\.com\/mail\/.+?\/.+?\/.+?#.+?\/.*/];
const targetNode = document.body;
const config = { attributes: false, childList: true, subtree: false};
const flag1 = [
  "urgent",
  "compel",
  "critical",
  "crucial",
  "demand",
  "essential",
  "imperative",
  "indispensable",
  "vital",
  "hurry-up",
  "insist",
  "life and death",
  "paramount",
  "imminent",
  "grave",
  "warn",
  "danger",
  "desperate"
];

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
    addAnalysisBlock();
    called = true;
  }
  else if(!matchUrl && called){
    removeBlock();
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
  var el = createNode("div", "emailResult", undefined, undefined);
  insertAfter(document.getElementById(":4"), el);

  //Block content
  var titleNode = createNode("h3", "result", undefined, "Results: Not Suspicious");
  var titleSpan = createNode("span", undefined, ["titleSpan"], undefined);
  var titleButton = createNode("button", "resultButton", undefined, "Click here for more info");

  titleSpan.appendChild(titleButton);
  titleNode.appendChild(titleSpan);
  document.getElementById('emailResult').appendChild(titleNode);
};

//Remove blocks
function removeBlock(){
  document.getElementById("emailResult").remove();
  document.getElementById("emailAnalysis").remove();
};

//Create analysis block
function addAnalysisBlock(){
  var el = createNode("div", "emailAnalysis", undefined, "Note: There is always a change of false positive or false negative. It is important to double-check before judgement.");
  var email = document.getElementById(":3");
  var sus = [false, false, false, false, false, false, false]; //each index represent a flag

  //1st flag
  for (let i = 0; i < flag1.length; i+=1){
    if(email.innerHTML.indexOf(flag1[i]) !== -1){
      sus[0] = true;
      console.log(flag1[i])
      break;
    }
  }
  if(sus[0] === true){
    var flag1El = createNode("h4", "f1", undefined, "Flag 1: Contains urgent or threatening language")
    el.appendChild(flag1El);
  }
  
  //2nd flag

  //3rd flag

  //4th flag

  //5th flag

  //6th flag

  //7th flag

  //Append and hide
  insertAfter(document.getElementById("emailResult"), el);
  el.style.display = "none";
  document.getElementById("resultButton").onclick = toggleAnalysis;

  //Update Results
  if (sus.includes(true)){
    console.log("hi")
    document.getElementById("result").firstChild.nodeValue = "Results: Suspicious"
    //change colour of block
    //add recommendation
  }
  else{
    //change colour of block
  }
};

function toggleAnalysis(){
  var analysisBlock = document.getElementById("emailAnalysis");

  if(analysisBlock.style.display === "none"){
    analysisBlock.style.display = "block";
  }
  else{
    analysisBlock.style.display = "none";
  }
};

var observer = new MutationObserver(callback);
observer.observe(targetNode, config);