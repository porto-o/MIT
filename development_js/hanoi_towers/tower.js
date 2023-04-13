let counter = 0;

let pegs = [];
let diskArray = []; // this stores the disks
const game = document.getElementById('game');

const writeAll = (pegMap) => {
  let s = JSON.stringify(pegMap);
  // write output
  console.log(s);
  pegHist.push(JSON.parse(s));
};
const pegHist = [];
const pegMap = {
  A: [],
  B: [],
  C: [],
};
const pegArray = ['A', 'B', 'C'];
const updateMapAndPlot = (pegMap, from, to) => {
  try {
    let theDisk = pegMap[from].pop(); // this actually moves the disk
    pegMap[to].push(theDisk);
    writeAll(pegMap);
  } catch (e) {
    console.log('no disk in Map');
  }
};

// Pegs  A   B   C
// disks are labeled 0 to N
let moves = 0;
const moveDisks = function (n, from, to, spare) {
  if (n === 1) {
    updateMapAndPlot(pegMap, from, to);
    moves++;
  } else {
    moveDisks(n - 1, from, spare, to);
    updateMapAndPlot(pegMap, from, to);
    moves++;
    moveDisks(n - 1, spare, to, from);
  }
};
// given from and to figure out the other peg
const missing = (from, to) => {
  const all = {
    A: 1,
    B: 2,
    C: 3,
  };
  let total = all[from] + all[to];
  let miss = 5 - total; // 0 based so not 6 but one less
  let keys = Object.keys(all); // array of keys
  return keys[miss];
};

const initialize = (nDisks, pegMap) => {
  for (let i = nDisks; i >= 1; i--) {
    pegMap['A'].push(i); // this stacks disks with smallest on top
  }
  writeAll(pegMap);
};



function plotAll(pegMap) {
  pegArray.map((peg, pegindex) => {
    // loop over all pegs
    let disks = pegMap[peg]; // the array of disks on pegMap.A for example
    if (disks.length > 0) {
      disks.map((disk, index) => {
        pickDisk = diskArray.filter((item) => {
          // pick out correct disk from diskArray
          return item.id == disk;
        });
        positionDisk(pickDisk[0].newdiv, disk, index, pegindex); // disk is the disk number where larger is wider disk
      });
    }
  });
}

function positionDisk(domdiv, diskNumber, indexOnPeg, pegindex) {
  // set its position
  let pegCenter = 300 * pegindex + 100;
  let diskWidth = diskNumber * 40 + 20;
  let base = 400;
  let diskHeight = 20;

  domdiv.style.left = pegCenter - diskWidth / 2;
  domdiv.style.width = diskWidth;
  domdiv.style.top = 400 - diskHeight * indexOnPeg;
  console.log('Disk:' + diskNumber + ' at top: ' + domdiv.style.top);
  domdiv.style.height = diskHeight;
  domdiv.innerHTML = '  ' + diskNumber;
}
const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

function diskFactory(id, indexOnPeg, pegNumber, type) {
  // this determines start positions
  let newdiv = document.createElement('div');
  positionDisk(newdiv, id, indexOnPeg, pegNumber);
  newdiv.setAttribute('class', type); // these are the pegs
  newdiv.setAttribute('id', id);
  game.appendChild(newdiv);
  return {
    id,
    newdiv,
  };
}

function pegFactory(id, indexOnPeg, pegNumber, type) {
  // this determines start positions
  let newdiv = document.createElement('div');
  newdiv.setAttribute('class', 'peg'); // these are the pegs
  newdiv.setAttribute('id', id);
  let pegCenter = 300 * pegNumber + 60;
  let base = 400;
  let diskHeight = 200;
  newdiv.style.left = pegCenter;
  newdiv.style.width = 20;
  newdiv.style.top = 200;
  newdiv.style.height = 200;
  game.appendChild(newdiv);
}

function initializeDisks(pegMap) {
  let disks = pegMap[pegArray[0]]; // all disks start on peg 0
  diskArray = disks.map((diskid, indexOnPeg) => {
    // this is a kind of shadow DOM
    return diskFactory(diskid, indexOnPeg, 0, 'disk');
  });
  pegArray.map((item, pegId) => {
    pegFactory(pegId, 0, pegId, 'peg');
  });
}

function makeMove() {
  const nDisks = document.getElementById("numDisk").value;
  console.log(nDisks);
  if (counter == 0) {
    initialize(nDisks, pegMap);
    moveDisks(nDisks, 'A', 'C', 'B');
    initializeDisks(pegHist[0]);
  }
  if (counter < pegHist.length) {
    plotAll(pegHist[counter]);
  } else {
    alert('Tower is Finished');
  }
  counter++;
}

