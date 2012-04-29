var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};

function toolTip(node) {
  var returnString = "<ul>";
  var ql = node.data.ql;
  for (prop in ql) {
    returnString += "<li><b>"+prop+":</b> "+ql[prop].value+"</li>";
  }
  return returnString + "</ul>";
}

function nodeEditor(node) {
  var html = "<h4>" + node.name + "</h4>";
  html += "<form><fieldset><legend>Properties:</legend>";
  var ql = node.data.ql;
  for (prop in ql) {
    html += "<label for='"+prop+"'>"+prop+": </label>";
    if (ql[prop].type === "boolean") {
      html += "<input type='checkbox' name='"+prop+"' id='"+prop+"' checked='"+(ql[prop].value?"yes":"no")+"' /><br>";
    } else if (ql[prop].type === "file") {
      html += "<input type='file' name='"+prop+"'' id='"+prop+"' /><br>";
    } else if (ql[prop].type === "char") {
      html += "<input type='text' name='"+prop+"'' id='"+prop+"' size=1 value=\""+ql[prop].value+"\"/><br>";
    } else if (ql[prop].type === "text") {
      html += "<input type='text' name='"+prop+"'' id='"+prop+"' value=\""+ql[prop].value+"\"/><br>";
    } else {
      html += prop;
    }
  }
  html += "</fieldset>";
        //append connections information
        $jit.id('inner-details').innerHTML = html;
      }


function init(){
  // init data
  var json = [
      {
        "id": "csv-input1",
        "name": "csv-input1",
        "data": {
          //"$type": "rectangle",
          "ql": {
             filename: { value: "somename", type: "file" },
             header: { value: false, type: "boolean" },
             separator: { value: ';', type: "char" }
          }
        },
        "adjacencies": [ {
              "nodeTo": "csv-output1",
              "data": {
                "$type": "arrow",
                "$color": "#909291",
                "$lineWidth": 2,
              } }  ]
      },
      {
        "id": "csv-output1",
        "name": "csv-output1",
        "data": {
          //"$type": "circle",
          "ql": {
             filename: { value: "some other name", type: "file" },
             header: { value: true, type: "boolean" },
             separator: { value: ',', type: "char" }
          }
        }
      }
  ];
  // end
  // init ForceDirected
  var fd = new $jit.ForceDirected({
    //id of the visualization container
    injectInto: 'canvas_area',
    //Enable zooming and panning
    //by scrolling and DnD
    Navigation: {
      enable: true,
      //Enable panning events only if we're dragging the empty
      //canvas (and not a node).
      panning: 'avoid nodes',
      zooming: 100 //zoom speed. higher is more sensible
    },
    // Change node and edge styles such as
    // color and width.
    // These properties are also set per node
    // with dollar prefixed data-properties in the
    // JSON structure.
    Node: {
      overridable: true,
      height: 20,  
      width: 60,  
      type: 'rectangle',  
      color: '#aaa'
    },
    Edge: {
      overridable: true,
      color: '#23A4FF',
      lineWidth: 0.4
    },
    //Native canvas text styling
    Label: {
      type: labelType, //Native or HTML
      size: 10,
      style: 'bold'
    },
    //Add Tips
    Tips: {
      enable: true,
      onShow: function(tip, node) {
        //count connections
        var count = 0;
        node.eachAdjacency(function() { count++; });
        //display node info in tooltip
        tip.innerHTML = "<div class=\"tip-title\">" + node.name + "</div>"
          + "<div class=\"tip-text\"><b>settings:</b> " + toolTip(node) + "</div>";
      }
    },
    // Add node events
    Events: {
      enable: true,
      type: 'Native',
      //Change cursor style when hovering a node
      onMouseEnter: function() {
        fd.canvas.getElement().style.cursor = 'move';
      },
      onMouseLeave: function() {
        fd.canvas.getElement().style.cursor = '';
      },
      //Update node positions when dragged
      onDragMove: function(node, eventInfo, e) {
          var pos = eventInfo.getPos();
          node.pos.setc(pos.x, pos.y);
          fd.plot();
      },
      //Implement the same handler for touchscreens
      onTouchMove: function(node, eventInfo, e) {
        $jit.util.event.stop(e); //stop default touchmove event
        this.onDragMove(node, eventInfo, e);
      },
      //Add also a click handler to nodes
      onClick: function(node) {
        if(!node) return;
        nodeEditor(node);
        // Build the right column relations list.
        // This is done by traversing the clicked node connections.
        // var html = "<h4>" + node.name + "</h4><b> connections:</b><ul><li>",
        //     list = [];
        // node.eachAdjacency(function(adj){
        //   list.push(adj.nodeTo.name);
        // });
        // //append connections information
        // $jit.id('inner-details').innerHTML = html + list.join("</li><li>") + "</li></ul>";
      }
    },
    //Number of iterations for the FD algorithm
    iterations: 200,
    //Edge length
    levelDistance: 130,
    // Add text to the labels. This method is only triggered
    // on label creation and only for DOM labels (not native canvas ones).
    onCreateLabel: function(domElement, node){
      domElement.innerHTML = node.name;
      var style = domElement.style;
      style.width = 60 + 'px';  
      style.height = 17 + 'px';              
      style.cursor = 'pointer';  
      style.color = '#333';  
      style.fontSize = '0.8em';  
      style.textAlign= 'center';  
      style.paddingTop = '-3px';  

    },
    // Change node styles when DOM labels are placed
    // or moved.
    onPlaceLabel: function(domElement, node){
      var style = domElement.style;
      var left = parseInt(style.left);
      var top = parseInt(style.top);
      var w = domElement.offsetWidth;
      style.left = (left - w / 2) + 'px';
      style.top = (top + 10) + 'px';
      style.display = '';
    }
  });
  // load JSON data.
  fd.loadJSON(json);
  // compute positions incrementally and animate.
  fd.computeIncremental({
    iter: 40,
    property: 'end',
    onStep: function(perc){
      Log.write(perc + '% loaded...');
    },
    onComplete: function(){
      Log.write('done');
      fd.animate({
        modes: ['linear'],
        transition: $jit.Trans.Elastic.easeOut,
        duration: 2500
      });
    }
  });
  // end
}