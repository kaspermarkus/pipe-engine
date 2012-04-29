var functions_list = { 
    "input-csv": {
        "source": "string",
        "docstring": "input csv doc",
        "parameters": {
            "filename": {
                "type": "file"
            },
            "header?": {
                "type": "boolean"
            },
            "separator": {
                "type": "char"
            }
        },
        "connections": [ 0, 1 ]
    }, 
    "output-csv": {
        "source": "string",
        "docstring": "output csv doc",
        "parameters": {
            "filename": {
                "type": "file"
            },
            "header?": {
                "type": "boolean"
            },
            "separator": {
                "type": "char"
            }
        },
        "connections": [ 1, 0 ]
    }, 
    "drop-columns": {
        "source": "string",
        "docstring": "string",
        "parameters": {
            "keys": {
                "type": "array",
                "details": {
                    "type": "column-header"
                }
            },
            "table": {
                "type": "table"
            }
        },
        "connections": [ 1, 1 ]
    },
    "str-columns": {
        "source": "string",
        "docstring": "string",
        "parameters": {
            "key1": {
                "type": "column-header"
            },
            "key2": {
                "type": "column-header"
            },
            "separator": {
                "type": "string"
            },
            "table": {
                "type": "table"
            }
        },
        "connections": [ 0, 1 ]
    }
}; 

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
        $jit.id('property_area').innerHTML = html;
      }

(function($){
  var GraphModel = Backbone.Model.extend({
    initialize: function() {
      var graphModel = this;
      console.log("GRAPHMODEL");
      graphModel.fd = new $jit.ForceDirected({
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
            var returnString = "<ul>";
            var ql = node.data.ql;
            for (prop in ql) {
              returnString += "<li><b>"+prop+":</b> "+ql[prop].value+"</li>";
            }
            returnString += "</ul>";
              //display node info in tooltip
              tip.innerHTML = "<div class=\"tip-title\">" + node.name + "</div>"
                + "<div class=\"tip-text\"><b>settings:</b> " + returnString + "</div>";
            }
        },
        // Add node events
        Events: {
          enable: true,
          type: 'Native',
          //Change cursor style when hovering a node
          onMouseEnter: function() {
            graphModel.fd.canvas.getElement().style.cursor = 'move';
          },
          onMouseLeave: function() {
            graphModel.fd.canvas.getElement().style.cursor = '';
          },
          //Update node positions when dragged
          onDragMove: function(node, eventInfo, e) {
              var pos = eventInfo.getPos();
              node.pos.setc(pos.x, pos.y);
              graphModel.fd.plot();
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

    },
            // load JSON data.
    drawGraph: function() {
      var that = this;
      that.fd.loadJSON(this.get("graph"));
     // compute positions incrementally and animate.
      that.fd.computeIncremental({
        iter: 40,
        property: 'end',
        onStep: function(perc){
          Log.write(perc + '% loaded...');
        },
        onComplete: function(){
          Log.write('done');
          that.fd.animate({
            modes: ['linear'],
            transition: $jit.Trans.Elastic.easeOut,
            duration: 2500
          });
        }
      });
    }
  });

  var DetailsModel = Backbone.Model.extend({
  });

  var DetailsView = Backbone.View.extend({
    el: $('#details_area'),

    initialize: function(){
      _.bindAll(this, 'render');
      this.model = new DetailsModel();
      this.render();
    },
    render: function(){
      var self = this;
      $(this.el).html(this.model.get('body'));
    },
    updateMsg: function(body) {
        this.model.set({ body: body });
        console.log(body);
        this.render();
    },
    clearMsg: function() {
        this.model.set({ body: ""});
        this.render();
    }
  });
  var detailsView = new DetailsView();

  var NodeTemplate = Backbone.Model.extend({
  });

  var NodeTemplateView = Backbone.View.extend({
    tagName: 'li', // name of (orphan) root tag in this.el
    detailsView: detailsView,
    events: {
        'hover span': 'explode',
        'click span': 'addNode' 
    },

    initialize: function(){
      _.bindAll(this, 'render', 'explode'); // every function that uses 'this' as the current object should be in here
    },
    render: function(){
      $(this.el).html('<span id="'+this.model.get('id')+'">'+this.model.get('id')+'</span>');
      return this; // for chainable calls, like .render().el
    },
    explode: function(evt) {
      if (evt.type === "mouseenter") {
        this.detailsView.updateMsg("<div id='node_documentation'><h3>Node Documentation</h3><p>"+
          this.model.get('properties').docstring+"</p></div>");
      } else {
        this.detailsView.clearMsg();
      }
    },
    addNode: function(evt) {
      var id = this.model.get('id');
      var props = this.model.get('properties');
      var node = {};
      node.id = id;
      node.name = id;
      node.data = {};
      node.data.ql = props.parameters;
      node.data.meta = {
        maxInputs: props.connections[0],
        maxOutputs: props.connections[1]
      };
    //     "input-csv": {
    //     "source": "string",
    //     "docstring": "input csv doc",
    //     "parameters": {
    //         "filename": {
    //             "type": "file"
    //         },
    //         "header?": {
    //             "type": "boolean"
    //         },
    //         "separator": {
    //             "type": "char"
    //         }
    //     },
    //     "connections": [ 0, 1 ]
    // }, 
    //   {
    //     "id": "csv-output1",
    //     "name": "csv-output1",
    //     "data": {
    //       //"$type": "circle",
    //       "ql": {
    //          filename: { value: "some other name", type: "file" },
    //          header: { value: true, type: "boolean" },
    //          separator: { value: ',', type: "char" }
    //       }
    //     }
    //   }
     // console.log(node);
      json.push(node);
      console.log(json);
      graphGui.loadJSON(json);
      graphGui.computeIncremental({
    iter: 40,
    property: 'end',
    onStep: function(perc){
      Log.write(perc + '% loaded...');
    },
    onComplete: function(){
      Log.write('done');
      graphGui.animate({
        modes: ['linear'],
        transition: $jit.Trans.Elastic.easeOut,
        duration: 2500
      });
    }
  });

    }
  });

  var Palette = Backbone.Collection.extend({
    model: NodeTemplate
  });
  
  var PaletteView = Backbone.View.extend({
    el: $('#palette_area'), // el attaches to existing element
    events: {
      //'click button#add': 'addNodeTemplate'
    },
    initialize: function(){
      _.bindAll(this, 'render', 'addNodeTemplate', 'renderNodeTemplate'); // every function that uses 'this' as the current object should be in here
      
      this.collection = new Palette();
      this.collection.bind('add', this.renderNodeTemplate); // collection event binder

      this.render();
    },
    render: function(){
      var self = this;
      $(this.el).append("<h3>Palette</h3>");
      $(this.el).append("<ul></ul>");
      _(this.collection.models).each(function(item){ // in case collection is not empty
        self.renderNodeTemplate(item);
      }, this);
    },
    addNodeTemplate: function(node_id, props){
      //console.log(arg);
      var item = new NodeTemplate();
      item.set({
        id: node_id,
        properties: props,
        part2: item.get('part2') // modify item defaults,
      });
      this.collection.add(item);
    },
    renderNodeTemplate: function(item){
      var itemView = new NodeTemplateView({
        model: item
      });
      $('ul', this.el).append(itemView.render().el);
    }
  });



  //var graphGui = init(json);
  //graphGui.updateGraph(json);
  var paletteView = new PaletteView();  
  
  $.each(functions_list, function (node_id, props) {
      console.log(node_id);
      paletteView.addNodeTemplate(node_id, props);
  });
  detailsView.updateMsg("<h1>Kasper</h1>");
  var graph = new GraphModel();
  graph.set({ graph: json });
  graph.drawGraph();


})(jQuery);