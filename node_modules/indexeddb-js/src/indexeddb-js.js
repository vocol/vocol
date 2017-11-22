// -*- coding: utf-8 -*-
//-----------------------------------------------------------------------------
// file: $Id$
// lib:  indexeddb-js
// desc: provides basic indexedDB access to sqlite3 in javascript/node-js.
//
//       JUST TO BE CLEAR: this module is not intended to provide a
//       "production" level implementation: it is primarily intended
//       to emulate a real indexedDB implementation, such as a
//       browser, in order to be able to do unit-testing.
//
// auth: metagriffin <metagriffin@uberdev.org>
// date: 2012/11/02
// copy: (C) CopyLoose 2012 UberDev <hardcore@uberdev.org>, No Rights Reserved.
//-----------------------------------------------------------------------------

// for node compatibility...
if ( typeof(define) !== 'function')
  var define = require('amdefine')(module);

define(['underscore'], function(_) {

  var exports = {};

  //---------------------------------------------------------------------------
  var j      = function(obj) { return JSON.stringify(obj); };
  var uj     = function(str) { return JSON.parse(str); };
  var defer  = function(cb, object) {
    if ( object != undefined )
      cb = _.bind(cb, object);
    if ( typeof(process) == 'undefined' )
      setTimeout(cb, 0);
    else
      process.nextTick(cb);
  };
  var makeID = function() {
    // shamelessly scrubbed from:
    //   http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    // (adjusted to remove the dashes)
    // todo: see some of those links on how to make this more "robust"...
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  };
  var safeName = function(name) {
    name = escape(name);
    return name
      .replace(/_/g, '_5f')
      .replace(/%/g, '_25')
      .replace(/\*/g, '_2a')
      .replace(/@/g, '_40')
      .replace(/\-/g, '_2d')
      .replace(/\+/g, '_2b')
      .replace(/\./g, '_2e')
      .replace(/\//g, '_2f');
  };

  //---------------------------------------------------------------------------
  var Event = function(target) {
    this._preventDefault = false;
    this.preventDefault = function() {
      this._preventDefault = true;
    };
    this.target = target;
    if ( this.target.error && this.target.errorCode )
      this.toString = function() {
        return '[' + this.target.errorCode + '] ' + this.target.error;
      };
    return this;
  };

  //---------------------------------------------------------------------------
  var Request = function() {
    this._error = function(next, code, message) {
      this.error = '[' + code + '] ' + message;
      err = new Event(_.extend(this, {error: this.error, errorCode: code}));
      // console.log('ERROR: indexedDB.Request: ' + err.target.error);
      this._errpub(next, err);
    };
    this._errevt = function(next, err) {
      this.error = err;
      err = new Event(_.extend(this, {error: this.error, errorCode: this.error.code}));
      // console.log('ERROR: indexedDB.Request: ' + err.target.error);
      this._errpub(next, err);
    };
    this._errpub = function(next, err) {
      if ( this.onerror )
        this.onerror(err);
      if ( ! err._preventDefault && next )
        next._error(err);
    };
  };

  //---------------------------------------------------------------------------
  // TODO: make these extend DOMException...
  // TODO: make this nicer
  // TODO: define and use these instead of the custom error garbage
  exports.VersionError = function(code, message) {
    this.name = 'VersionError';
    this.code = code;
    this.message = message;
    this.toString = function() {
      if ( ! code )
        return message;
      return '[' + code + '] ' + this.name + ': ' + message;
    }
  };
  //   UnknownError
  //   ConstraintError
  //   DataError
  //   TransactionInactiveError
  //   ReadOnlyError
  // these should already be pre-defined somewhere...
  exports.NotFoundError = function(code, message) {
    this.name = 'NotFoundError';
    this.code = code;
    this.message = message;
    this.toString = function() {
      if ( ! code )
        return message;
      return '[' + code + '] ' + this.name + ': ' + message;
    }
  };
  //   InvalidStateError
  //   InvalidAccessError
  //   AbortError
  //   TimeoutError
  //   QuotaExceededError
  //   SyntaxError
  //   DataCloneError

  //---------------------------------------------------------------------------
  var IDBKeyRange = function(lower, upper, lowerOpen, upperOpen) {
    // -- read-only attributes...
    this.lower     = lower;
    this.upper     = upper;
    this.lowerOpen = !! lowerOpen;
    this.upperOpen = !! upperOpen;
    return this;
  };

  //---------------------------------------------------------------------------
  IDBKeyRange.only = function(value) {
    return new IDBKeyRange(value, value, false, false);
  };
  IDBKeyRange.lowerBound = function(value, open) {
    return new IDBKeyRange(value, undefined, open, false);
  };
  IDBKeyRange.upperBound = function(value, open) {
    return new IDBKeyRange(undefined, value, false, open);
  };
  IDBKeyRange.bound = function(lower, upper, lowerOpen, upperOpen) {
    return new IDBKeyRange(lower, upper, lowerOpen, upperOpen);
  };

  //---------------------------------------------------------------------------
  IDBKeyRange.prototype.check = function(value) {
    if ( this.lower !== undefined )
    {
      if ( value == this.lower )
        return ! this.lowerOpen;
      if ( value < this.lower )
        return false;
    }
    if ( this.upper !== undefined )
    {
      if ( value == this.upper )
        return ! this.upperOpen;
      if ( value > this.upper )
        return false;
    }
    return true;
  };

  //---------------------------------------------------------------------------
  var Index = function(store, name) {
    // TODO: implement these attributes...
    // this.keyPath = ...;
    // this.multiEntry = ...;
    // this.name = ...;
    this.objectStore = store;
    // this.unique = ...;

    // -- private attributes
    this._name     = name;
    this._error    = function(event) {
      // console.log('ERROR: indexedDB.Store[' + this._txn._db.name + '.'
      //             + this.name + ']: ' + event.target.error);
      if ( this.onerror )
        this.onerror(event);
      if ( ! event._preventDefault )
        this.objectStore._error(event);
    };

    //-------------------------------------------------------------------------
    this.get = function(value) {
      return this._get(value, false);
    };

    //-------------------------------------------------------------------------
    this.getKey = function(value) {
      return this._get(value, true);
    };

    //-------------------------------------------------------------------------
    this.count = function(key) {
      var req = new Request();
      if ( key && ! ( key instanceof IDBKeyRange ) )
        key = IDBKeyRange.only(key);
      // todo: this should really be optimized to tell _getAll to count
      //       the objects, not actually fetch them...
      this._getAll(req, key, function(err, objects) {
        if ( err )
          return req._error(this, 'indexeddb.Index.Ct.10',
                            'failed to fetch objects: ' + err);
        req.result = objects.length;
        if ( req.onsuccess )
          req.onsuccess(new Event(req));
      });
      return req;
    };

    //-------------------------------------------------------------------------
    this._get = function(value, key) {
      var req = new Request();
      this._getAll(req, IDBKeyRange.only(value), function(err, objects) {
        if ( err )
          return req._error(this, 'indexeddb.Index.iG.10',
                            'failed to fetch object by index: ' + err);
        if ( objects.length <= 0 )
          return req._error(this, 'indexeddb.Index.iG.20',
                            'no such index name in object store');
        req.result = objects[0][key ? 'key' : 'value'];
        if ( req.onsuccess )
          req.onsuccess(new Event(req));
      });
      return req;
    };

    //-------------------------------------------------------------------------
    this._getAll = function(request, range, cb, object) {
      var self = this;
      store._getAll(request, null, function(err, objects) {
        if ( err )
          return request._error(this, 'indexeddb.Index.iGA.10',
                                'failed to fetch objects by index: ' + err);
        var index = _.find(store._meta.index, function(e) { return e.name == self._name; });
        if ( index == undefined )
          return request._error(this, 'indexeddb.Index.iGA.20',
                            'no such index name in object store');
        if ( ! range )
          return cb.call(object, null, objects);
        cb.call(object, null, _.filter(objects, function(e) {
          return range.check(store._extractValue(e.value, index.keyPath));
        }));
      });
    };

    //-------------------------------------------------------------------------
    this.openCursor = function(range, direction) {
      var req = new Request();
      req.cursor = new Cursor(this, range, direction, false, req);
      req.cursor.continue();
      return req;
    };

    //-------------------------------------------------------------------------
    this.openKeyCursor = function(range, direction) {
      var req = new Request();
      req.cursor = new Cursor(this, range, direction, true, req);
      req.cursor.continue();
      return req;
    };

    return this;
  };

  //---------------------------------------------------------------------------
  var Cursor = function(source, range, direction, retkey, request) {

    this.source      = source;
    this.direction   = direction || 'next';
    // todo: implement these attributes...
    // this.primaryKey  = ...;

    if ( range && ! ( range instanceof IDBKeyRange ) )
      range = IDBKeyRange.only(range);

    // -- private attributes
    this._range    = range;
    this._request  = request;
    this._data     = null;
    this._next     = 0;
    this._retkey   = retkey;
    this._error    = function(event) {
      if ( this.onerror )
        this.onerror(event);
      if ( ! event._preventDefault )
        this.source._error(event);
    };

    //-------------------------------------------------------------------------
    this.continue = function() {
      defer(function() {
        if ( this.direction != 'next' )
          return this._request._error(this, 'indexeddb.Cursor.C.5',
                                      'non-"next" cursor direction not supported');
        if ( this._data == undefined )
          return this.source._getAll(this._request, this._range, function(err, rows) {
            if ( err )
              return this._request._error(this, 'indexeddb.Cursor.C.10',
                                          'failed to fetch data for cursor: ' + err);
            this._data = rows;
            this._next = 0;
            this.continue();
          }, this);
        if ( this._next >= this._data.length )
        {
          if ( this._request.onsuccess )
            this._request.onsuccess(new Event({result: null}));
          return;
        }
        this.key      = this._data[this._next].key;
        this.value    = this._data[this._next].value;
        this.position = this._next;
        this._next    += 1;
        if ( this._request.onsuccess )
          this._request.onsuccess(new Event({result: this}));
        return;
      }, this);
    };

    // todo: implement
    // this.update = function() {};
    // this.advance = function() {};
    // this.delete = function() {};

  };

  //---------------------------------------------------------------------------
  var Store = function(txn, name, options, create) {

    //: attribute `name` is read-only
    this.name      = name;

    //: callback `onerror` used to trap store-specific errors
    this.onerror   = null;

    // -- private attributes
    this._saved    = ! create;
    this._txn      = txn;
    this._meta     = {table: null, options: options, index: []};
    this._error    = function(event) {
      // console.log('ERROR: indexedDB.Store[' + this._txn._db.name + '.'
      //             + this.name + ']: ' + event.target.error);
      if ( this.onerror )
        this.onerror(event);
      if ( ! event._preventDefault )
        this._txn._error(event);
    };

    //-------------------------------------------------------------------------
    this.createIndex = function(name, keyPath, options) {
      if ( ! this._txn._db._upgrading )
        throw new Event({
          error: '"createIndex" can only be called during "onupgradeneeded" handling',
          errorCode: 'indexeddb.Store.CI.10'
        });
      this._meta.index.push({name: name, keyPath: keyPath, options: options});
      this._saved = false;
    };

    //-------------------------------------------------------------------------
    this._create = function(cb) {
      var req = new Request();
      this._withEngine(req, cb, this);
    };

    //-------------------------------------------------------------------------
    this._withEngine = function(request, cb, object) {
      if ( this._saved )
      {
        this._txn._db._withEngine(function(err, sdb) {
          if ( err )
            return cb.call(object, err);
          if ( this._meta.table != undefined )
            return cb.call(object, null, sdb);
          sdb.all(
            'SELECT c_meta FROM "idb.store" WHERE c_dbname = ? AND c_name = ?',
            this._txn._db.name, this.name,
            _.bind(function(err, rows) {
              if ( err )
                return request._error(this, 'indexeddb.Store.iWI.10', err);
              if ( rows.length <= 0 )
                return request._error(this, 'indexeddb.Store.iWI.11',
                                      'store "' + this._txn._db.name + '"."'
                                      + this.name + '" not found in idb.store');
              if ( rows.length > 1 )
                return request._error(this, 'indexeddb.Store.iWI.12',
                                      'internal error: redundant rows in idb.store');
              this._meta = uj(rows[0].c_meta);
              return cb.call(object, null, sdb);
            }, this)
          );
        }, this);
        return;
      }
      this._txn._db._withEngine(function(err, sdb) {
        if ( err )
          return cb.call(object, err);
        var doInsert = _.bind(function() {
          sdb.run(
            'INSERT OR REPLACE INTO "idb.store" (c_dbname, c_name, c_meta)'
              + ' VALUES ( ?, ?, ? )',
            this._txn._db.name, this.name, j(this._meta),
            function(err) {
              this._saved = true;
              return cb.call(object, null, sdb);
            });
          return;
        }, this);
        if ( this._meta.table != undefined )
          return doInsert();
        if ( this._meta.options.autoIncrement == true
             || this._meta.options.keyPath == undefined )
          // TODO: support auto-incrementing keys...
          return request._error(
            this,
            'indexeddb.Store.iWI.30',
            'auto-incrementing keys not implemented');
        this._meta.table = 'idb:' + safeName(this._txn._db.name)
          + '.' + safeName(this.name);
        sdb.run('CREATE TABLE "' + this._meta.table
                + '" (c_key TEXT UNIQUE NOT NULL PRIMARY KEY, c_value TEXT)',
                function(err) {
                  doInsert();
                });
        // todo: create index tables...
      }, this);
    };

    //-------------------------------------------------------------------------
    this._extractValue = function(object, path) {
      var walker = function(object, path) {
        if ( _.isArray(path) )
          return _.map(path, function(e) { return walker(object, e); }).join('');
        var idx = path.indexOf('.');
        if ( idx == -1 )
          return object[path];
        return '' + walker(object[path.slice(0, idx)], path.slice(idx + 1));
      };
      return walker(object, path || this._meta.options.keyPath);
    };

    //-------------------------------------------------------------------------
    this.add = function(object) {
      var req = new Request();
      this._withEngine(req, function(err, sdb) {
        if ( err )
          return req._error(this, 'indexeddb.Store.A.10',
                            'failed to open a transaction: ' + err);
        sdb.run(
          'INSERT INTO "' + this._meta.table + '" (c_key, c_value) VALUES ( ?, ? )',
          this._extractValue(object), j(object),
          _.bind(function(err) {
            if ( err )
              return req._error(this, 'indexeddb.Store.A.20',
                                'failed to add object: ' + err);
            if ( req.onsuccess )
              req.onsuccess(new Event(req));
          }, this)
        );
      }, this);
      return req;
    };

    //-------------------------------------------------------------------------
    this.get = function(objectID) {
      var req = new Request();
      this._withEngine(req, function(err, sdb) {
        if ( err )
          return req._error(this, 'indexeddb.Store.G.10',
                            'failed to open a transaction: ' + err);
        sdb.all(
          'SELECT c_value FROM "' + this._meta.table + '" WHERE c_key = ?',
          objectID,
          _.bind(function(err, rows) {
            if ( err )
              return req._error(this, 'indexeddb.Store.G.20',
                                'failed to fetch object: ' + err);
            if ( rows.length > 1 )
              return req._error(this, 'indexeddb.Store.G.40',
                                'internal error: multiple records for key');
            req.result = rows.length > 0 ? uj(rows[0].c_value) : undefined;
            if ( req.onsuccess )
              req.onsuccess(new Event(req));
          }, this)
        );
      }, this);
      return req;
    };

    //-------------------------------------------------------------------------
    this.put = function(object) {
      var req = new Request();
      this._withEngine(req, function(err, sdb) {
        if ( err )
          return req._error(this, 'indexeddb.Store.P.10',
                            'failed to open a transaction: ' + err);
        var self = this;
        sdb.run(
          'INSERT OR REPLACE INTO "' + this._meta.table + '" ( c_key, c_value)'
            + ' VALUES ( ?, ? )',
          this._extractValue(object), j(object),
          function(err) {
            if ( err )
              return req._error(self, 'indexeddb.Store.P.20',
                                'failed to update object: ' + err);
            if ( this.changes != 1 )
              return req._error(self, 'indexeddb.Store.P.30',
                                'unexpected number of changes: ' + diff.changes);
            req.result = object;
            if ( req.onsuccess )
              req.onsuccess(new Event(req));
          });
      }, this);
      return req;
    };

    //-------------------------------------------------------------------------
    this.delete = function(objectID) {
      var req = new Request();
      this._withEngine(req, function(err, sdb) {
        if ( err )
          return req._error(this, 'indexeddb.Store.D.10',
                            'failed to open a transaction: ' + err);
        var self = this;
        sdb.run(
          'DELETE FROM "' + this._meta.table + '" WHERE c_key = ?',
          objectID,
          function(err) {
            if ( err )
              return req._error(self, 'indexeddb.Store.D.20',
                                'failed to delete object: ' + err);
            if ( req.onsuccess )
              req.onsuccess(new Event(req));
          });
      }, this);
      return req;
    };

    //-------------------------------------------------------------------------
    this.clear = function() {
      var req = new Request();
      this._withEngine(req, function(err, sdb) {
        if ( err )
          return req._error(this, 'indexeddb.Store.C.10',
                            'failed to open a transaction: ' + err);
        sdb.run(
          'DELETE FROM "' + this._meta.table + '"',
          _.bind(function(err) {
            if ( err )
              return req._error(self, 'indexeddb.Store.C.20',
                                'failed to clear object store: ' + err);
            if ( req.onsuccess )
              req.onsuccess(new Event(req));
          }, this)
        );
      }, this);
      return req;
    };

    //-------------------------------------------------------------------------
    this.count = function(key) {
      var req = new Request();
      if ( key && ! ( key instanceof IDBKeyRange ) )
        key = IDBKeyRange.only(key);
      // todo: this should really be optimized to tell _getAll to count
      //       the objects, not actually fetch them...
      this._getAll(req, key, function(err, objects) {
        if ( err )
          return req._error(this, 'indexeddb.Store.Ct.10',
                            'failed to fetch objects: ' + err);
        req.result = objects.length;
        if ( req.onsuccess )
          req.onsuccess(new Event(req));
      });
      return req;
    };

    //-------------------------------------------------------------------------
    this._getAll = function(request, range, cb, object) {
      this._withEngine(request, function(err, sdb) {
        if ( err )
          return req._error(this, 'indexeddb.Store.iGA.10',
                            'failed to open a transaction: ' + err);
        if ( range != undefined )
          return cb.call(object,
                         {code: 'indexeddb.Store.iGA.20',
                          message: 'range operation not supported'});
        sdb.all(
          'SELECT c_key, c_value FROM "' + this._meta.table + '"',
          _.bind(function(err, rows) {
            if ( err )
              return cb.call(object,
                             {code: 'indexeddb.Store.iGA.30',
                              message: 'failed to fetch objects: ' + err});
            cb.call(object, null, _.map(rows, function(e) {
              return {key: e.c_key, value: uj(e.c_value)};
            }));
          }, this)
        );
      }, this);
    };

    //-------------------------------------------------------------------------
    this.index = function(name) {
      return new Index(this, name);
    };

    //-------------------------------------------------------------------------
    this.openCursor = function(range, direction) {
      var req = new Request();
      req.cursor = new Cursor(this, range, direction, false, req);
      req.cursor.continue();
      return req;
    };

    //-------------------------------------------------------------------------
    this.openKeyCursor = function(range, direction) {
      var req = new Request();
      req.cursor = new Cursor(this, range, direction, true, req);
      req.cursor.continue();
      return req;
    };

    // todo: implement:
    // this.deleteIndex = function(key) {};

  };

  //---------------------------------------------------------------------------
  var Transaction = function(db, stores, mode) {
    this.db              = db;
    this.mode            = mode || 'readonly';
    this.error           = null;
    this.onerror         = null;
    this.onabort         = null;
    this.oncomplete      = null;
    this.preventDefault  = function() {
      this._preventDefault = true;
    };

    // -- private attributes
    this._db             = db;
    this._stores         = stores ? ( _.isArray(stores) ? stores : [stores] ) : [];
    this._preventDefault = false;
    this._error          = function(event) {
      // console.log('ERROR: indexedDB.Transaction[' + this.db.name + ']: ' + event.target.error);
      if ( this.onerror )
        this.onerror(event);
      if ( ! event._preventDefault )
        this.db._error(event);
    };

    //-------------------------------------------------------------------------
    this.objectStore = function(name) {
      // todo: check that this store already exists (or that this is a versionchange)
      if ( this._stores.length > 0 && _.indexOf(this._stores, name) == -1 )
        return (new Request())._error(
          this,
          'indexeddb.Transaction.OS.10',
          'request for out-of-transaction-context object store "' + name + '"');
      return this.db._openStore(this, name);
    };

    // todo: implement:
    // this.abort = function() {};

  };

  //---------------------------------------------------------------------------
  var Database = function(conn, name, version) {

    //: attribute `name` is read-only
    this.name = name;

    //: attribute `version` is read-only
    this.version = version;

    //: attribute `objectStoreNames` is read-only
    this.objectStoreNames = [];

    //: callback `onerror` used to trap database-specific errors
    this.onerror   = null;

    // -- private attributes
    this._conn     = conn;
    this._meta     = {stores: []};
    this._error    = function(event) {
      // console.log('ERROR: indexedDB.Database[' + this.name + ']: ' + event.target.error);
      if ( this.onerror )
        this.onerror(event);
    };

    //-------------------------------------------------------------------------
    this._load = function(request) {
      this._withEngine(function(err, sdb) {
        if ( err )
          return request._error(null, 'indexeddb.Database.iL.10',
                                'failed to open a transaction: ' + err);

        var self = this;
        sdb.run('CREATE TABLE IF NOT EXISTS "idb.database"'
                + ' (c_name TEXT UNIQUE NOT NULL PRIMARY KEY'
                + ', c_version INTEGER'
                + ', c_meta TEXT)');
        sdb.run('CREATE TABLE IF NOT EXISTS "idb.store"'
                + ' (c_dbname TEXT'
                + ', c_name TEXT'
                + ', c_meta TEXT,'
                + '  PRIMARY KEY (c_dbname, c_name) )');
        sdb.all(
          'SELECT c_version, c_meta FROM "idb.database" WHERE c_name = ?',
          self.name,
          function(err, rows) {
            if ( err )
              return request._error(
                null, 'indexeddb.Database.iL.20',
                'could not select from database: ' + err);
            if ( rows.length > 1 )
              return request._error(
                null, 'indexeddb.Database.iL.21',
                'internal error: received multiple records for idb.database query');
            if ( rows.length == 1 )
            {
              self._meta = uj(rows[0].c_meta);

              sdb.all(
                'SELECT c_dbname, c_name FROM "idb.store"', // WHERE c_dbname = ?',
                // self.name,
                function(err, stores) {
                  if ( err )
                    return request._error(
                      null, 'indexeddb.Database.iL.22',
                      'could not select store names from database: ' + err);

                  self.objectStoreNames = _.map(stores, function(record) {
                    return record.c_name;
                  });
                  self.objectStoreNames.sort();
                  var cur = rows[0].c_version;
                  if ( self.version == undefined || self.version == cur )
                  {
                    self.version = cur;
                    if ( request.onsuccess )
                      return request.onsuccess(new Event(request));
                    return;
                  }
                  if ( self.version < cur )
                    return request._errevt(
                      null,
                      new exports.VersionError(
                        'indexeddb.Database.iL.25',
                        'current database version ' + cur
                          + ' exceeds requested version ' + self.version));
                  sdb.run(
                    'UPDATE "idb.database" SET c_version = ? WHERE c_name = ?',
                    self.version, self.name,
                    function(err) {
                      if ( err )
                        return request._error(
                          null, 'indexeddb.Database.iL.26',
                          'could not update database version: ' + err);
                      return self._upgrade(request);
                    });

                });

              return;
            }
            self.version = self.version || 1;
            sdb.run(
              'INSERT INTO "idb.database" VALUES ( ? , ? , ? )',
              self.name, self.version, j(self._meta),
              function(err) {
                if ( err )
                  return request._error(
                    null, 'indexeddb.Database.iL.30',
                    'could not insert new database: ' + err);
                return self._upgrade(request);
              })
          });
      }, this);
    };

    //-------------------------------------------------------------------------
    this._upgrade = function(request) {
      var self = this;
      var ret = new Event(request);
      ret.target.transaction = {mode: 'versionchange'};
      this._upgrading = [];
      if ( request.onupgradeneeded )
        request.onupgradeneeded(ret);
      var upgrades = this._upgrading;
      this._upgrading = null;
      var handle_upgrades = function(ops) {
        if ( ops.length <= 0 )
        {
          ret.target.transaction = null;
          if ( request.onsuccess )
            return request.onsuccess(ret);
          return;
        }
        var next = ops.shift();
        switch ( next[0] )
        {
          case 'create':
          {
            next[1]._create(function(err) {
              if ( err )
                return request._error(null, 'indexeddb.Database.iU.10', err);
              self.objectStoreNames.push(next[1].name);
              self.objectStoreNames.sort();
              handle_upgrades(ops);
            });
            return;
          }
          case 'delete':
          {
            // todo: what about active Store objects still open?...
            self._withEngine(function(err, sdb) {
              if ( err )
                return request._error(null, 'indexeddb.Database.iU.20', err);
              sdb.run(
                'DELETE FROM "idb.store" WHERE c_dbname = ? AND c_name = ?',
                self.name, next[1],
                function(err) {
                  if ( err )
                    return request._error(
                      null, 'indexeddb.Database.iU.22',
                      'could not remove table "' + self.name + '.'
                        + next[1] + '": ' + err);
                  self.objectStoreNames = _.filter(self.objectStoreNames, function(name) {
                    return name != next[1];
                  });
                  // todo: DRY! (this should be loaded from the database...)
                  var datatable = 'idb:' + safeName(self.name)
                    + '.' + safeName(next[1]);
                  sdb.run(
                    'DROP TABLE "' + datatable + '"',
                    function(err) {
                      if ( err )
                        return request._error(
                          null, 'indexeddb.Database.iU.23',
                          'could not remove data for "' + self.name + '.'
                            + next[1] + '": ' + err);
                      handle_upgrades(ops);
                    });
                });
            });
            return;
          }
        }
        return request._error(
          null, 'indexeddb.Database.iU.50',
          'internal error: unexpected table operation: ' + next[0]);
      };
      handle_upgrades(upgrades);
    };

    //-------------------------------------------------------------------------
    this._withEngine = function(cb, context) {
      defer(function() {
        var sdb = this._conn._driver;
        sdb.serialize(function() {
          cb.call(context, null, sdb);
        });
      }, this);
    };

    //-------------------------------------------------------------------------
    this.createObjectStore = function(name, options) {
      // todo: check that it doesn't already exist or is being created...
      if ( ! this._upgrading )
        throw new Event({
          error: '"createObjectStore" can only be called during "onupgradeneeded" handling',
          errorCode: 'indexeddb.Database.COS.10'
        });
      var txn = new Transaction(this, name, 'readwrite');
      var store = new Store(txn, name, options, true);
      this._upgrading.push(['create', store]);
      return store;
    };

    //-------------------------------------------------------------------------
    this.deleteObjectStore = function(name) {
      // todo: check that it isn't being created...
      if ( ! this._upgrading )
        throw new Event({
          error: '"deleteObjectStore" can only be called during "onupgradeneeded" handling',
          errorCode: 'indexeddb.Database.DOS.10'
        });
      if ( ! _.contains(this.objectStoreNames, name) )
        throw new exports.NotFoundError(
          'indexeddb.Database.DOS.11',
          'no such table "' + this.name + '.' + name + '"');
      this._upgrading.push(['delete', name]);
    };

    //-------------------------------------------------------------------------
    this.transaction = function(stores, mode) {
      if ( this._upgrading )
        throw new Event({
          error: '"transaction" cannot be called during "onupgradeneeded" handling',
          errorCode: 'indexeddb.Database.T.10'
        });
      return new Transaction(this, stores, mode);
    };

    //-------------------------------------------------------------------------
    this.setVersion = function(version) {
      var req = new Request();
      // TODO: implement
      // todo: is this subject to _upgrading?
      // console.log('ERROR: indexeddb.Database.setVersion() not implemented...');
      defer(function(){req._error(this, 'indexeddb.Database.SV.10',
                                  'setVersion() not implemented');}, this);
      return req;
    };

    //-------------------------------------------------------------------------
    this._openStore = function(txn, name) {
      return new Store(txn, name, null, false);
    };

    //-------------------------------------------------------------------------
    this.close = function() {
      // todo: disable all other methods...
    };

  };

  //---------------------------------------------------------------------------
  exports.indexedDB = function(driverName, driverInstance) {

    // -- private attributes
    this._type   = driverName;
    this._driver = driverInstance;

    this.vendor  = 'indexeddb-js';
    // TODO: pull this dynamically from package.json somehow?...
    this.version = '0.0.14';

    //-------------------------------------------------------------------------
    this.open = function(name, version) {
      var request = _.extend(new Request(), {
        onversionchange: null,
        onupgradeneeded: null,
        onblocked:       null,
        onerror:         null,
        onsuccess:       null,
        result:          new Database(this, name, version, false)
      });
      request.result._load(request);
      return request;
    };

    // todo: implement:
    // this.deleteDatabase = function(name) {};
    // this.cmp = function(first, second) {};

    return this;
  };

  //---------------------------------------------------------------------------
  exports.initScope = function(driverName, driverInstance, scope) {
    scope.indexedDB = new exports.indexedDB(driverName, driverInstance);
    scope.IDBKeyRange = IDBKeyRange;
    return scope;
  };

  //---------------------------------------------------------------------------
  exports.makeScope = function(driverName, driverInstance) {
    return exports.initScope(driverName, driverInstance, {});
  };

  return exports;

});

//-----------------------------------------------------------------------------
// end of $Id$
//-----------------------------------------------------------------------------
