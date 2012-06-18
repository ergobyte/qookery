/**
 * Form components are the topmost components in a Qookery form's component hierarchy,
 * 
 * They are responsible, among others, for managing children components, maintaining bindings, 
 * handling data validation and providing scripting contexts to event handlers.
 */
qx.Class.define("qookery.internal.components.FormComponent", {

	extend: qookery.internal.components.ContainerComponent,
	implement: [ qookery.IFormComponent ],

	construct: function() {
		this.base(arguments, null);
		this.__id = "-";
		this.__controller = new qx.data.controller.Object();
		this.__validationManager = new qx.ui.form.validation.Manager();
		this.__userContextMap = [ ];
		this.__componentMap = { };
	},

	events: {
		"formClose": "qx.event.type.Event",
		"modelChanged" : "qx.event.type.Event"
	},

	members: {

		__id: null,
		__controller: null,
		__componentMap: null,
		__validationManager: null,
		__userContextMap: null,
		
		create: function(createOptions) {
			this.__id = createOptions['id'] || this.toString();
			this._numOfColumns = createOptions['numOfColumns']; // TODO in case numOfColumns is null, find a way to caculate the num of childs
			this._grabHorizontal = createOptions['grabHorizontal'] == "true";
			this._layout = new qx.ui.layout.Grid();
			this._widgets[0] = new qx.ui.container.Composite(this._layout);
			this.base(arguments, createOptions);
		
		},
		
		listWidgets: function(filterName) {
			if(filterName == "user") return [ this ];
			return this.base(arguments, filterName);
		},
		
		getId: function() {
			return this.__id;
		},

		setModel: function(model) {
			qx.log.Logger.debug(this, "Setting model");
			if(model == null) return;
			this.__controller.setModel(model);
			this.fireEvent("modelChanged", qx.event.type.Event, null);
		},

		getModel: function() {
			return this.__controller.getModel();
		},

		getController: function() {
			return this.__controller;
		},

		getComponentById: function(id) {
			return this.__componentMap[id];
		},

		registerComponent: function(component, id) {
			this.__componentMap[id] = component;
		},

		getUserContext: function(id) {
			return this.__userContextMap[id];
		},

		registerUserContext: function(id, userContext) {
			this.__userContextMap[id] = userContext;
		},

		getForm: function() {
			return this;
		},

		getValidationManager: function() {
			return this.__validationManager;
		},

		validate: function() {
			this.__validationManager.validate();
		},

		clearValidations: function() {
			var items = this.getValidationManager().getItems();
			if( items == null ) return;
			for(var item in items) {
				this.getValidationManager().remove(item);
			}
		},

		dispose: function() {
			this.fireEvent("formClose", qx.event.type.Event, null);
			this.base(arguments);
		}
	},

	destruct: function() {
		qx.log.Logger.debug(this, qx.lang.String.format("Qookery form '%1' is being destructed", [ this.__id ]));
		
		//this.__controller.removeAllBindings(); // Remove all bindings
		//this.__controller.setModel(null);	// Just to be sure
		this.__controller.dispose();
		
		// Remove all validations
		var validationItems = this.__validationManager.getItems();
		for(var validationItem in validationItems)
			this.__validationManager.remove(validationItem); 
		
		this.__validationManager.dispose();
		// this.__controller = null;
		this.__validationManager = null;
		this.__componentMap = null;
		this.__userContextMap = null;
		this.__registration = null;
	}
});
