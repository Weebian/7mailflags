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
const flag2 = [
  "login",
  "password",
  "credit card",
  "bank",
  "finance",
  "financial",
  "remittance",
  "crypto"
];
const flag3 = [
  "prize",
  "lottery",
  "inheritance",
  "gift",
  "congrat",
  "congratulation"
];
const flag4 = [
  "purchase",
  "buy",
  "sell",
  "deliver",
  "parcel",
  "order number",
  "gift"
];
const flag5 = [
  "<a href=",
  "gmal",
  "gmil"
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
  var email = document.getElementById(":1");
  var sus = [false, false, false, false, false, false, false]; //each index represent a flag

  //1st flag
  var flag1El = flagTriggered(email, flag1, "f1", "Flag 1: Contains urgent or threatening language");
  if(flag1El !== undefined){
    el.appendChild(flag1El);
    sus[0] = true;
  }
  
  //2nd flag
  var flag2El = flagTriggered(email, flag2, "f2", "Flag 2: Requests For Sensitive Information");
  if(flag2El !== undefined){
    el.appendChild(flag2El);
    sus[1] = true;
  }

  //3rd flag
  var flag3El = flagTriggered(email, flag3, "f3", "Flag 3: Anything too good to be true");
  if(flag3El !== undefined){
    el.appendChild(flag3El);
    sus[2] = true;
  }

  //4th flag
  var flag4El = flagTriggered(email, flag4, "f4", "Flag 4: Unexpected emails");
  if(flag4El !== undefined){
    el.appendChild(flag4El);
    sus[3] = true;
  }

  //5th flag
  var flag5El = flagTriggered(email, flag5, "f5", "Flag 5: Potential information Mismatches");
  if(flag5El !== undefined){
    el.appendChild(flag5El);
    sus[4] = true;
  }

  //6th flag

  //7th flag

  //Append and hide
  insertAfter(document.getElementById("emailResult"), el);
  el.style.display = "none";
  document.getElementById("resultButton").onclick = toggleAnalysis;

  //Update Results
  if (sus.includes(true)){
    document.getElementById("result").firstChild.nodeValue = "Results: Potentially Suspicious"
    //change colour of block
    //add recommendation
  }
  else{
    //change colour of block
  }
};

function flagTriggered(mailBlock, flagList, flagID, flagText){
  for (let i = 0; i < flagList.length; i+=1){
    if(mailBlock.innerHTML.indexOf(flagList[i]) !== -1){
      console.log(flagList[i])
      return createNode("h4", flagID, undefined, flagText);
    }
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