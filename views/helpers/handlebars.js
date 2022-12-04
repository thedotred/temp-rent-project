var register = function(Handlebars) {
    var helpers = {
      ifEquals: function(arg1, arg2, options) {
        if (arg1 == arg2) 
          return options.fn(this) 
        else 
          return options.inverse(this);
      },
      ifGreater: function(arg1, arg2, options) {
        if (arg1 > arg2) 
          return options.fn(this) 
        else 
          return options.inverse(this);
      },
      ifExists: function(value, values, options) {
        if (values.indexOf(value) > -1) 
          return options.fn(this) 
        else 
          return options.inverse(this);
      },
      ifNotExists: function(value, values, options) {
        if (values.indexOf(value) === -1) 
          return options.fn(this) 
        else 
          return options.inverse(this);
      },
      //Handlebars section
      section: function(name, options){
        if(!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
      },
    };
  
    if (Handlebars && typeof Handlebars.registerHelper === "function") {
      for (var prop in helpers) {
          Handlebars.registerHelper(prop, helpers[prop]);
      }
    } else {
      return helpers;
    }
  
  };
  
  module.exports.register = register;
  module.exports.helpers = register(null);