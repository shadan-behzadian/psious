const container = document.querySelector(".container");
const growBtn = document.getElementById("growBtn");
const boxOneBtn = document.getElementById("boxOneBtn");
const boxTwoBtn = document.getElementById("boxTwoBtn");
const boxThreeBtn = document.getElementById("boxThreeBtn");
const exportButton = document.getElementById("export");
growBtn.addEventListener("click", growContainer);
exportButton.addEventListener("click", function () {
  let results = saveData(allBoxIDs);
  printResults(results);
  allBoxIDs = [];
});

boxOneBtn.addEventListener("click", function () {
  createBox("orange");
});

boxTwoBtn.addEventListener("click", function () {
  createBox("pink");
});

boxThreeBtn.addEventListener("click", function () {
  createBox("yellow");
});
let all = [];
let allBoxIDs = [];
exportButton.disabled = true;
let isResizing = false;
let resultsPrinted = false;

function growContainer() {
  containerRect = container.getBoundingClientRect();

  container.style.height = containerRect.height + 40 + "px";
}
function createBox(boxType) {
  let copyBox = document.createElement("div");
  let layOut = document.querySelector(".layOut");
  let ID = "_" + Math.random().toString(20).substr(2, 3);
  let boxName = document.createElement("div");
  boxName.classList.add("boxName");
  boxName.textContent = ID;
  copyBox.classList.add("draggables");
  copyBox.classList.add(boxType);
  copyBox.setAttribute("id", ID);
  layOut.appendChild(copyBox);
  let resizerEast = document.createElement("div");
  let resizerWest = document.createElement("div");
  resizerEast.classList.add("resizer");
  resizerEast.classList.add("e");
  resizerWest.classList.add("resizer");
  resizerWest.classList.add("w");
  copyBox.appendChild(resizerEast);
  copyBox.appendChild(resizerWest);
  copyBox.appendChild(boxName);
  allBoxIDs.push(ID);
  dragElements(allBoxIDs);
  exportButton.disabled = true;
  resizing();
}
function dragElements(allBoxIDs) {
  for (let eachboxID of allBoxIDs) {
    let draggable = document.getElementById(eachboxID);
    draggable.addEventListener("mousedown", mousedown);
    function mousedown(e) {
      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);
      let prevX = e.clientX;
      let prevY = e.clientY;
      function mousemove(e) {
        const boxRect = draggable.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        if (
          boxRect.top > containerRect.top &&
          boxRect.left > containerRect.left &&
          boxRect.bottom < containerRect.bottom &&
          boxRect.right < containerRect.right
        ) {
          document.body.style.cursor = "pointer";
          draggable.classList.add("inside");
          draggable.classList.remove("outside");
        } else {
          document.body.style.cursor = "not-allowed";
          draggable.classList.remove("inside");
          draggable.classList.add("outside");
        }

        let currentDraggingBoxID = document.getElementById(e.target.id);

        if (currentDraggingBoxID != null) {
          current = currentDraggingBoxID.getBoundingClientRect();
        }
        for (box in all) {
          if (all[box].id == e.target.id) {
            all.splice(box);
          }
        }

        if (!isResizing) {
          if (all.length != 0) {
            for (box in all) {
              let currentX = current.x - containerRect.x;
              let currentY = current.y - containerRect.y;

              if (
                currentY + current.height > all[box].y &&
                currentY < all[box].y + all[box].height &&
                ((currentX > all[box].x &&
                  currentX < all[box].x + all[box].width) ||
                  (currentX + current.width > all[box].x &&
                    currentX + current.width < all[box].x + all[box].width))
              ) {
                document.body.style.cursor = "not-allowed";
                draggable.classList.remove("inside");
                draggable.classList.add("outside");
                alert("not allowed");
              }
            }
          }

          let newX = prevX - e.clientX;
          let newY = prevY - e.clientY;

          draggable.style.left = boxRect.left - newX + "px";
          draggable.style.top = boxRect.top - newY + "px";

          prevX = e.clientX;
          prevY = e.clientY;
        }
      }
      function mouseup() {
        const boxRect = draggable.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        if (
          boxRect.top > containerRect.top &&
          boxRect.left > containerRect.left &&
          boxRect.bottom < containerRect.bottom &&
          boxRect.right < containerRect.right
        ) {
          window.removeEventListener("mousemove", mousemove);
          window.removeEventListener("mouseup", mouseup);
          let ocuppiedLocations;
          ocuppiedLocations = saveData(allBoxIDs);

          all = [...ocuppiedLocations];

          resultsPrinted
            ? (exportButton.disabled = true)
            : (exportButton.disabled = false);
        }
      }
    }
  }
}
function resizing() {
  const resizers = document.querySelectorAll(".resizer");
  for (let resizer of resizers) {
    resizer.addEventListener("mousedown", mousedown);

    let currentResizer;

    function mousedown(e) {
      currentResizer = e.target;
      isResizing = true;
      let prevX = e.clientX;

      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);

      function mousemove(e) {
        const rect = currentResizer.parentNode.getBoundingClientRect();

        const containerRect = container.getBoundingClientRect();

        if (currentResizer.classList.contains("e")) {
          if (rect.width - (prevX - e.clientX) < containerRect.width - 5) {
            currentResizer.parentNode.style.width =
              rect.width - (prevX - e.clientX) + "px";
          }
        } else if (currentResizer.classList.contains("w")) {
          if (rect.width - (prevX - e.clientX) < containerRect.width - 5) {
            currentResizer.parentNode.style.width =
              rect.width + (prevX - e.clientX) + "px";
            currentResizer.parentNode.style.left =
              rect.left - (prevX - e.clientX) + "px";
          }
        }

        prevX = e.clientX;
      }

      function mouseup() {
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
        isResizing = false;
      }
    }
  }
}
function saveData(allBoxIDs) {
  let results = [];
  for (boxID of allBoxIDs) {
    let eachbox = document.getElementById(boxID);
    let eachboxCoordinates = eachbox.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    let obj = {};
    obj["id"] = boxID;
    obj["width"] = eachboxCoordinates.width;
    obj["x"] = eachboxCoordinates.x - containerRect.x;
    obj["y"] = eachboxCoordinates.y - containerRect.y;
    obj["top"] = eachboxCoordinates.top - containerRect.top;
    obj["left"] = eachboxCoordinates.left - containerRect.left;
    obj["right"] = containerRect.right - eachboxCoordinates.right;
    obj["bottom"] = containerRect.bottom - eachboxCoordinates.bottom;
    obj["height"] = eachboxCoordinates.height;

    results.push(obj);
  }
  return results;
}
function printResults(results) {
  let finalResults = document.querySelector(".finalResults");

  results.forEach((obj) => {
    let eachBoxResult = document.createElement("div");
    if (obj.hasOwnProperty("id")) {
      let boxInfoID = document.createElement("div");
      boxInfoID.textContent = "Box ID: " + obj["id"];

      eachBoxResult.appendChild(boxInfoID);
    }
    if (obj.hasOwnProperty("width")) {
      let boxInfoWidth = document.createElement("div");
      boxInfoWidth.textContent = "Box Width: " + obj["width"] + "px";
      eachBoxResult.appendChild(boxInfoWidth);
    }
    if (obj.hasOwnProperty("X")) {
      let boxInfoX = document.createElement("div");
      boxInfoX.textContent = "Box X axis: " + obj["X"];
      eachBoxResult.appendChild(boxInfoX);
    }
    if (obj.hasOwnProperty("Y")) {
      let boxInfoY = document.createElement("div");
      boxInfoY.textContent = "Box Y axis: " + obj["Y"];
      eachBoxResult.appendChild(boxInfoY);
    }
    if (obj.hasOwnProperty("top")) {
      let boxInfotop = document.createElement("div");
      boxInfotop.textContent = "Box top : " + obj["top"] + "px";
      eachBoxResult.appendChild(boxInfotop);
    }
    if (obj.hasOwnProperty("left")) {
      let boxInfoleft = document.createElement("div");
      boxInfoleft.textContent = "Box left: " + obj["left"] + "px";
      eachBoxResult.appendChild(boxInfoleft);
    }
    if (obj.hasOwnProperty("right")) {
      let boxInforight = document.createElement("div");
      boxInforight.textContent = "Box right: " + obj["right"] + "px";
      eachBoxResult.appendChild(boxInforight);
    }
    if (obj.hasOwnProperty("right")) {
      let boxInfobottom = document.createElement("div");
      boxInfobottom.textContent = "Box bottom: " + obj["bottom"] + "px";
      eachBoxResult.appendChild(boxInfobottom);
    }

    finalResults.appendChild(eachBoxResult);
  });
  boxOneBtn.disabled = true;
  boxTwoBtn.disabled = true;
  boxThreeBtn.disabled = true;
  exportButton.disabled = true;
  growBtn.disabled = true;

  document.body.style.cursor = "not-allowed";
  container.style.cursor = "not-allowed";

  resultsPrinted = true;
}
