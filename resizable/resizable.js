steal.plugins('jquery/controller','phui/wrapper','jquery/event/drag','jquery/dom/dimensions','phui/filler')
     .then(function(){
	 	$.Controller.extend("Phui.Resizable",{
			defaults : {
				minHeight: 10,
				minWidth: 10,
				handles : 'e, s, se'
			}
		},
		{
			setup : function(el, options){
				var diff = $(el).phui_wrapper()[0]
				this._super(diff, options)
				if(diff != el){
					this.original = $(el).phui_filler(); //set to fill
				}
			},
			directionInfo: {
				"s" : {
					limit : "vertical",
					dim :  "height"
				},
				"e" : {
					limit : "horizontal",
					dim :  "width"
				},
				"se" : {
					
				}
			},
			init : function(el, options){
				//draw in resizeable
				this.element.prepend("<div class='ui-resizable-e ui-resizable-handle'/><div class='ui-resizable-s ui-resizable-handle'/><div class='ui-resizable-se ui-resizable-handle'/>")
			},
			getDirection : function(el){
				return el[0].className.match(/ui-resizable-(se|s|e)/)[1]
			},
			".ui-resizable-handle dragstart" : function(el, ev, drag){
				//get direction
				//how far is top corner 
				this.margin = this.element.offsetv().plus(this.element.dimensionsv()).minus(  el.offsetv()  ) 
				
				var direction = this.getDirection(el)
				ev.stopPropagation();
				console.log(direction, this.directionInfo[direction].limit)
				if(this.directionInfo[direction].limit)
					drag[this.directionInfo[direction].limit]()
			},
			".ui-resizable-handle dragmove" : function(el, ev, drag){

				ev.preventDefault(); //prevent from drawing .. 
				var direction = this.getDirection(el);

				if(direction.indexOf("s") > -1){
					//console.log("doing s")
					var top = drag.location.y();
				
					var start = this.element.offset().top;
					var outerHeight = top-start
					if(outerHeight < this.options.minHeight){
						outerHeight = this.options.minHeight
					}
					this.element.outerHeight(outerHeight+this.margin.y())
					
				}
				if(direction.indexOf("e") > -1){
					//console.log("doing e")
					var left = drag.location.x();
				
					var start = this.element.offset().left;
					var outerWidth = left-start
					if(outerHeight < this.options.minWidth){
						outerWidth = this.options.minWidth
					}
					this.element.outerWidth(outerWidth+this.margin.x())
					
				}
				this.element.trigger("resize")
			}
		})
		
	 })
