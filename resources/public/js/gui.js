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

(function($){
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
        'hover span': 'explode' 
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



  var paletteView = new PaletteView();  
  
  $.each(functions_list, function (node_id, props) {
      console.log(node_id);
      paletteView.addNodeTemplate(node_id, props);
  });
  detailsView.updateMsg("<h1>Kasper</h1>");


})(jQuery);