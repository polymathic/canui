steal.plugins('jquery/controller','jquery/view/ejs').then(function($){
	
	/**
	 * A Sortable, Filterable Datatable.
	 */
	$.Controller.extend('Phui.Datatable',
	{
		defaults : {
		},
		listensTo : []
	},
	{
		/**
		 * Setup
		 */
		init : function(){
			this.data = {
				'fields' : this.options.fields,
				'rows' : this.options.rows
			}
			this.draw(this.data);
		},
		
		draw : function(data){
			this.element.html(this.view('//phui/datatable/table.ejs', data));
			this.find('tbody tr:even').css('background-color','#DFDFDF');			
		},
		
		'th click' : function(el, ev){
			// default to string type
			var self = this;
			var field = el.attr('field');
			$.each( this.data.fields, function(i,f){
				if(f.name === field){
					var type = f.type ? f.type : 'string';
        			self.data.rows.sort(function(a, b){return self[type+'Sort'](a[f.name], b[f.name])});
		            return false;			
				};
			});
			this.draw(this.data);
		},
		
		stringSort : function(a, b){
		    return a > b ? 1 : -1;  
		},
		
		numericSort : function(a, b){
		    return a > b ? 1 : -1;  
		},
		
		dateSort: function(a, b){
			return new Date(a) > new Date(b) ? 1 : -1;
		},
		
		'th mouseover' : function(el, ev){
			el.addClass("ui-state-hover");
			el.css("cursor","pointer");
		},
		
		'th mouseout' : function(el, ev){
			el.removeClass("ui-state-hover");
			el.css("cursor","");			
		}		
    
	});
	


});