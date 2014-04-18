{
	init: function (callback) {
		delete Meta.config;

		Meta.configs.list(function (err, config) {
			if(err) {
				winston.error(err);
				return callback(err);
			}

			Meta.config = config;
			callback();
		});
	},
	list: function (callback) {
		db.getObject('config', function (err, config) {
			if(err) {
				return callback(err);
			}

			config = config || {};
			config.status = 'ok';
			callback(err, config);
		});
	},
	get: function (field, callback) {
		db.getObjectField('config', field, callback);
	},
	getFields: function (fields, callback) {
		db.getObjectFields('config', fields, callback);
	},
	set: function (field, value, callback) {
		if(!field) {
			return callback(new Error('invalid config field'));
		}

		db.setObjectField('config', field, value, function(err, res) {
			if (callback) {
				if(!err && Meta.config) {
					Meta.config[field] = value;
				}

				callback(err, res);
			}
		});
	},
	setOnEmpty: function (field, value, callback) {
		Meta.configs.get(field, function (err, curValue) {
			if(err) {
				return callback(err);
			}

			if (!curValue) {
				Meta.configs.set(field, value, callback);
			} else {
				callback();
			}
		});
	},
	remove: function (field) {
		db.deleteObjectField('config', field);
	}
};