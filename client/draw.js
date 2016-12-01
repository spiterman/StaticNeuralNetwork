// *** Globals ***
const canvas = $('#canvas');
var maxNeurons  = 30;
var neuronDistance = 3;
var neuronRadius = 25;
// var activeColor = 'yellow';
// var inactiveColor = 'red';

// ** Neuron
function Neuron(x, y, n){
  this.x = x;
  this.y = y;
  this.groups = [n];
  this.dragGroups = [n];
  this.name = 'N' + n;
}

// Default Neurons
Neuron.prototype = Object.create({
  strokeWidth: 4,
  strokeStyle: 'black',
  draggable: true,
  type: 'arc',
  radius: 25,
  fillStyle: 'red'
});

// Neuron.prototype.dragstop = redrawConnections; //
// Neuron.prototype.dblclick = dblClickFunction; //Maybe switch assignment based on optino


// Spinners
// function Spinner(){};

// Spinner.prototype = Object.create(Neuron.prototype, {
//   spinnerConcavity: 0.5,
//   spinnerSides: 5,
//   type: 'polygon'
// });

// Text
function Text(x, y, n){
  this.x = x;
  this.y = y;
  this.groups = [n];
  this.dragGroups = [n];
  this.text = n;
};

Text.prototype = Object.create({
  strokeWidth: 3,
  strokeStyle: 'black',
  type: 'text'
});

// Connections
function Connection(endpoints){
  this.x1 = endpoints.x1;
  this.x2 = endpoints.x2;
  this.y1 = endpoints.y1;
  this.y2 = endpoints.y2;
  this.name = endpoints.name;
};

Connection.prototype = Object.create({
  type: 'line',
  strokeStyle: 'black',
  strokeWidth: 4,
  endArrow: true,
  arrowRadius: 15,
  arrowAngle: 90
});


// ** Control Panel
var currentNodeType = "connection";
var currentDblClickAction = "activateNodes";

// ** Simulation
var simulationSpeed = 2000;
var isSimulationRunning = false;


// App Stuff

// Create a graph from newApp.js
var graph = new Graph();


//Main Functions
canvas.click(function(e) {

  var x = e.offsetX;
  var y = e.offsetY;
  if(isValidPosition(x, y)){
    addNeuron(x, y, counter);
  }
});

function addNeuron(x, y, n){
  var node = graph.addNode();
  var neuron = new Neuron(x, y, n);
  console.log(neuron.name);
  var text = new Text(x, y, n);
  $.extend(neuron, Neuron.prototype);
  $.extend(text, Text.prototype);
  canvas.addLayer(neuron)
        .addLayer(text)
        .drawLayers();
};

function addConnection(start, end){
  graph.connectNodes(start, end);
  var endpoints = generateEndpoints(start, end);
  var connection = new Connection(endpoints);
  $.extend(connection, Connection.prototype);
  console.log(connection);
  canvas.addLayer(connection)
        .drawLayers();
}

function deleteConnection(start, end){

}

function updateConnections(str){
  var start = $('#startNode');
  var end = $('#endNode');
  // console.log(start.val(), end.val());
  if(str === 'connect'){
    addConnection(start.val(), end.val());
  }
  if(str === 'disconnect'){
    // Disconnect Functionality;
    deleteConnection(start.val(), end.val());
  }

  start.val("");
  end.val("");
}



// function addNode() {
//   if(counter <= maxNeurons ){
//     graph.addNode();
//     drawNeuron();
//   } else {
//     alert('Maximum number of neurons reached!')
//   }
// }



//***Simulation Functionality
function simulate() {
  if(isSimulationRunning){
    // stateVector.moveToNextState();
    graph.updateState();
    setTimeout(function(){
      simulate();
    }, simulationSpeed)
  }
}

function runSimulation(){
  isSimulationRunning = true;
  simulate();
}

function endSimulation() {
  isSimulationRunning = false;
}


//***Control Panel Functions***
function setNodeType(str) {
  var nodeTypes = [$('#input'), $('#connection'), $('#output')];
  nodeTypes.forEach((item) => item.removeClass('active'));
  $('#' + str).addClass('active');
  currentNodeType = str;
}

setDblClickAction = function(str){
  var dblClickActions = [$('#activateNodes'), $('#deleteNodes')];
  dblClickActions.forEach( (item) => item.removeClass('active'));
  $('#' + str).addClass('active');
  currentDblClickAction = str;
}

//Activates the dropdown toggle
$(document).ready(function() {
    $(".dropdown-toggle").dropdown();
});