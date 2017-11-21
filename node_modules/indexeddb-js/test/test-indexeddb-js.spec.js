// -*- coding: utf-8 -*-
//-----------------------------------------------------------------------------
// file: $Id$
// desc: unit test for the indexeddb-js module
// auth: metagriffin <metagriffin@uberdev.org>
// date: 2012/10/13
// copy: (C) CopyLoose 2012 UberDev <hardcore@uberdev.org>, No Rights Reserved.
//-----------------------------------------------------------------------------

// for node compatibility...
if ( typeof(define) !== 'function' )
  var define = require('amdefine')(module);

define([
  'underscore',
  'sqlite3',
  '../src/indexeddb-js'
], function(_, sqlite3, indexeddbjs) {

  describe('indexeddb-js', function() {

    var j = function(o) { return JSON.stringify(o); };
    var testDbName = 'testdb';

    // none of these tests should take very long...
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 250;

    //-------------------------------------------------------------------------
    var createTestDbHelper = function(options) {
      // var sdb     = new sqlite3.Database('./test.db');
      var sdb     = new sqlite3.Database(':memory:');
      var scope   = indexeddbjs.makeScope('sqlite3', sdb);
      var req     = scope.indexedDB.open(options.name || testDbName, options.version);
      req.onerror = options.onerror
        || function(event) { options.callback('error: ' + event.target.error); };
      req.onversionchange = options.onversionchange
        || function(event) { options.callback('error: unexpected "onversionchange"'); };
      req.onblocked = options.onblocked
        || function(event) { options.callback('error: unexpected "onblocked"'); };
      req.onupgradeneeded = options.onupgradeneeded
        || function(event) { options.callback('error: unexpected "onupgradeneeded"'); };
      req.onsuccess = options.onsuccess
        || function(event) { options.callback('error: unexpected "onsuccess"'); };
      return scope;
    };

    //-------------------------------------------------------------------------
    var createTestDb = function(cb) {
      var upgraded = false;
      var scope = createTestDbHelper({
        name: testDbName,
        callback: cb,
        onupgradeneeded: function(event) {
          upgraded = true;
          var db = event.target.result;
          var store = db.createObjectStore('data', {keyPath: 'id'});
          store.createIndex('value', 'value', {unique: false});
          store.createIndex('count', 'count', {unique: false});
          var store2 = db.createObjectStore('longdata', {keyPath: 'id'});
          store2.createIndex('name', 'name', {unique: false});
          store.add({id: '1', value: 'foo1', count: 3}).onsuccess = function() {
            store.add({id: 2, value: 'zapper', count: 23}).onsuccess = function() {
              store.add({id: '3', value: 'zapper', count: 15}).onsuccess = function() {
                store2.add({id: 'long-id-1', name: 'long-name-1'}).onsuccess = function() {
                  store2.add({id: 'long-id-2', name: 'long-name-2'}).onsuccess = function() {
                    cb(null, db, scope);
                  };
                };
              };
            };
          };
        },
        onsuccess: function(event) {
          if ( upgraded )
            return;
          var db = event.target.result;
          return cb(null, db, scope);
        }
      });
    };

    //-------------------------------------------------------------------------
    it('triggers "onupgradeneeded" and "onsuccess" events serially', function(done) {
      var upgraded = false;
      var opened = false;
      createTestDbHelper({
        name: 'testdb-upgradeneeded-success',
        onupgradeneeded: function(event) {
          expect(upgraded).toBeFalsy();
          expect(opened).toBeFalsy();
          upgraded = true;
        },
        onsuccess: function(event) {
          expect(upgraded).toBeTruthy();
          expect(opened).toBeFalsy();
          opened = true;
          done();
        }
      });
    });

    //-------------------------------------------------------------------------
    it('creates new tables requested during "onupgradeneeded"', function(done) {
      var upgraded = false;
      var opened = false;
      var errorHandler = function(err) {
        expect('error callback call').toBe('never called');
        expect(err).not.toBeDefined();
        done();
      };
      createTestDbHelper({
        name: 'testdb-upgradeneeded-success',
        callback: errorHandler,
        onupgradeneeded: function(event) {
          var db = event.target.result;
          db.onerror = errorHandler;
          var store = db.createObjectStore('data', {keyPath: 'id'});
        },
        onsuccess: function(event) {
          var db = event.target.result;
          db.onerror = errorHandler;
          var txn = db.transaction(['data'], 'readwrite');
          var store = txn.objectStore('data');
          var request = store.add({id: '1', value: 'one'});
          request.onsuccess = function(event) {
            done();
          };
        }
      });
    });

    var shared_scope = null;

    //-------------------------------------------------------------------------
    var makeErrorHandler = function(name, errtype, cb) {
      var func = function(event) {
        var err = 'unexpected call to "' + name + '.' + errtype + '"';
        if ( event && event.target && event.target.error )
          err += ': ' + event.target.error;
        expect(err).toBeNull();
        return cb(err);
      };
      return func;
    };

    //-------------------------------------------------------------------------
    beforeEach(function(callback) {
      if ( ! shared_scope )
      {
        var sdb = new sqlite3.Database(':memory:');
        shared_scope = indexeddbjs.makeScope('sqlite3', sdb);
      }
      callback();
    });

    //-------------------------------------------------------------------------
    it('reports version changes correctly', function(done) {
      var idb = shared_scope;
      var name = 'indexeddb-js.test.versioning';
      var request = idb.indexedDB.open(name, 1);
      request.onerror = makeErrorHandler('versiontest', 'open.error', done);
      request.onblocked = makeErrorHandler('versiontest', 'open.blocked', done);
      request.onsuccess = function(event) {
        var db = event.target.result;
        expect(db.version).toEqual(1);
        expect(event.target.transaction).toBeNull();
        db.close();
        var req2 = idb.indexedDB.open(name, 7);
        req2.onerror = makeErrorHandler('reuse', 'open2.error', done);
        req2.onupgradeneeded = function(event) {
          var db = event.target.result;
          expect(db.version).toEqual(7);
          expect(event.target.transaction.mode).toEqual('versionchange');
        };
        req2.onsuccess = function(event) {
          var db = event.target.result;
          expect(db.version).toEqual(7);
          db.close();
          done();
        };
      };
    });

    //-------------------------------------------------------------------------
    it('fails on downgrade', function(done) {
      var idb = shared_scope;
      var name = 'indexeddb-js.test.versioning';
      var request = idb.indexedDB.open(name, 3);
      request.onblocked = makeErrorHandler('versiontest2', 'open.blocked', done);
      request.onsuccess = makeErrorHandler('versiontest2', 'open.success', done);
      request.onerror = function(event) {
        expect(event.target.error).toBeDefined();
        expect(event.target.error.name).toBe('VersionError');
        done();
      };
    });

    //-------------------------------------------------------------------------
    it('can be opened again in another test', function(done) {
      var idb = shared_scope;
      var name = 'indexeddb-js.test.versioning';
      var request = idb.indexedDB.open(name, 18);
      request.onerror = makeErrorHandler('versiontest3', 'open.error', done);
      request.onblocked = makeErrorHandler('versiontest3', 'open.blocked', done);
      request.onsuccess = function(event) {
        var db = event.target.result;
        expect(db.version).toEqual(18);
        expect(event.target.transaction).toBeNull();
        db.close();
        var req2 = idb.indexedDB.open(name, 29);
        req2.onerror = makeErrorHandler('versiontest3', 'open2.error', done);
        req2.onupgradeneeded = function(event) {
          var db = event.target.result;
          expect(db.version).toEqual(29);
          expect(event.target.transaction.mode).toEqual('versionchange');
        };
        req2.onsuccess = function(event) {
          var db = event.target.result;
          expect(db.version).toEqual(29);
          db.close();
          done();
        };
      };
    });

    //-------------------------------------------------------------------------
    it('implements CRUD for a simple record', function(done) {
      createTestDb(function(err, db) {
        expect(err).toBeFalsy();
        if ( err )
          return done();
        db.onerror = function(event) {
          // don't expect any errors to bubble up
          expect('db.onerror').toBe('never called');
          expect(event.target.error).toBeNull();
          return done();
        };
        // try read
        db.transaction().objectStore('data').get('1').onsuccess = function(event) {
          // console.log('fetched data: ' + j(event.target.result));
          expect(event.target.result.value).toEqual('foo1');
          // try write
          db.transaction(null, 'readwrite').objectStore('data')
            .put({id: 1, value: 'foo2'}).onsuccess = function(event) {
              // console.log('putted data');
              // confirm write
              db.transaction().objectStore('data').get('1').onsuccess = function(event) {
                // console.log('second fetched data: ' + j(event.target.result));
                expect(event.target.result.value).toEqual('foo2');
                // try delete
                db.transaction(null, 'readwrite').objectStore('data')
                  .delete('1').onsuccess = function(event) {
                    // console.log('deleted data');
                    // confirm delete
                    db.transaction().objectStore('data').get('1').onsuccess = function(event) {
                      expect(event.target.result).toBeUndefined();
                      done();
                    };
                  };
              };
            };
        };
      });
    });

    //-------------------------------------------------------------------------
    var getAllData = function(store, cb) {
      var data = [];
      store.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if ( cursor )
        {
          data.push(cursor.value);
          return cursor.continue();
        }
        return cb(null, data);
      };
    };

    //-------------------------------------------------------------------------
    it('implements `Store.clear`', function(done) {
      createTestDb(function(err, db) {
        expect(err).toBeFalsy();
        if ( err )
          return done();
        db.onerror = function(event) {
          // don't expect any errors to bubble up
          expect('db.onerror').toBe('never called');
          expect(event.target.error).toBeNull();
          return done();
        };
        var store = db.transaction().objectStore('data');
        getAllData(store, function(err, data) {
          expect(err).toBeFalsy();
          if ( err )
            return done();
          var chk = [
            {id: '1', value: 'foo1', count: 3},
            {id: 2, value: 'zapper', count: 23},
            {id: '3', value: 'zapper', count: 15}
          ];
          expect(_.sortBy(data, 'id')).toEqual(_.sortBy(chk, 'id'));
          store.clear().onsuccess = function(event) {
            getAllData(store, function(err, data) {
              expect(err).toBeFalsy();
              if ( err )
                return done();
              expect(data).toEqual([]);
              done();
            });
          };
        });
      });
    });

    //-------------------------------------------------------------------------
    it('implements `Store.count`', function(done) {
      createTestDb(function(err, db, scope) {
        expect(err).toBeFalsy();
        if ( err )
          return done();
        db.onerror = function(event) {
          // don't expect any errors to bubble up
          expect('db.onerror').toBe('never called');
          expect(event.target.error).toBeNull();
          return done();
        };
        var store = db.transaction().objectStore('data');
        store.count().onsuccess = function(event) {
          expect(event.target.result).toBe(3);
          // todo: when Store._getAll supports key ranges...
          // store.count(scope.IDBKeyRange.bound(2, 15)).onsuccess = function(event) {
          //   expect(event.target.result).toBe(2);
            store.clear().onsuccess = function(event) {
              store.count().onsuccess = function(event) {
                expect(event.target.result).toBe(0);
                done();
              };
            };
          // };
        };
      });
    });

    //-------------------------------------------------------------------------
    it('implements `Index.count`', function(done) {
      createTestDb(function(err, db, scope) {
        expect(err).toBeFalsy();
        if ( err )
          return done();
        db.onerror = function(event) {
          // don't expect any errors to bubble up
          expect('db.onerror').toBe('never called');
          expect(event.target.error).toBeNull();
          return done();
        };
        var store = db.transaction().objectStore('data');
        var index = store.index('count');
        index.count().onsuccess = function(event) {
          expect(event.target.result).toBe(3);
          index.count(scope.IDBKeyRange.bound(10, 30)).onsuccess = function(event) {
            expect(event.target.result).toBe(2);
            store.clear().onsuccess = function(event) {
              index.count().onsuccess = function(event) {
                expect(event.target.result).toBe(0);
                done();
              };
            };
          };
        };
      });
    });

    //-------------------------------------------------------------------------
    it('returns undefined for keys that don\'t exist', function(done) {
      createTestDb(function(err, db) {
        expect(err).toBeFalsy();
        if ( err )
          return done();
        db.onerror = function(event) {
          // don't expect any errors to bubble up
          expect('db.onerror').toBe('never called');
          expect(event.target.error).toBeNull();
          return done();
        };
        var store = db.transaction().objectStore('data');
        store.get(2).onsuccess = function(event) {
          expect(event.target.result).toEqual({id: 2, value: 'zapper', count: 23});
          store.get('no-such-key').onsuccess = function(event) {
            expect(event.target.result).toBeUndefined();
            done();
          };
        };
      });
    });

    //-------------------------------------------------------------------------
    it('supports index-based access to key/data', function(done) {
      createTestDb(function(err, db) {
        expect(err).toBeFalsy();
        if ( err )
          return done();
        db.onerror = function(event) {
          // don't expect any errors to bubble up
          expect('db.onerror').toBe('never called');
          expect(event.target.error).toBeNull();
          return done();
        };
        db.transaction().objectStore('data').index('value').get('foo1')
          .onsuccess = function(event) {
            expect(event.target.result.id).toEqual('1');
            db.transaction().objectStore('data').index('value').getKey('foo1')
              .onsuccess = function(event) {
                expect(event.target.result).toEqual('1');
                done();
              };
          };
      });
    });

    //-------------------------------------------------------------------------
    it('supports cursor-based access to key/data', function(done) {
      createTestDb(function(err, db) {
        expect(err).toBeFalsy();
        if ( err )
          return done();
        db.onerror = function(event) {
          // don't expect any errors to bubble up
          expect('db.onerror').toBe('never called');
          expect(event.target.error).toBeNull();
          return done();
        };
        var dataset = [];
        db.transaction().objectStore('data').openCursor().onsuccess = function(event) {
          var cursor = event.target.result;
          if ( cursor )
          {
            dataset.push(cursor.value.id + ':' + cursor.value.value);
            return cursor.continue();
          }
          dataset.sort()
          expect(dataset).toEqual(['1:foo1', '2:zapper', '3:zapper']);
          dataset = [];
          db.transaction().objectStore('data').index('value').openCursor('zapper')
            .onsuccess = function(event) {
              var cursor = event.target.result;
              if ( cursor )
              {
                dataset.push(cursor.value.id + ':' + cursor.value.value);
                return cursor.continue();
              }
              dataset.sort()
              expect(dataset).toEqual(['2:zapper', '3:zapper']);
              done();
            };
        };
      });
    });

    //-------------------------------------------------------------------------
    it('supports IDBKeyRange.only() operation', function(done) {
      createTestDb(function(err, db, scope) {
        expect(err).toBeFalsy();
        if ( err )
          return done();
        db.onerror = function(event) {
          // don't expect any errors to bubble up
          expect('db.onerror').toBe('never called');
          expect(event.target.error).toBeNull();
          return done();
        };
        var dataset = [];
        db.transaction().objectStore('data').index('value')
          .openCursor(scope.IDBKeyRange.only('zapper'))
          .onsuccess = function(event) {
            var cursor = event.target.result;
            if ( cursor )
            {
              dataset.push(cursor.value.id + ':' + cursor.value.value);
              return cursor.continue();
            }
            dataset.sort()
            expect(dataset).toEqual(['2:zapper', '3:zapper']);
            done();
          };
      });
    });

    //-------------------------------------------------------------------------
    it('supports IDBKeyRange.bound() (closed) operation', function(done) {
      createTestDb(function(err, db, scope) {
        expect(err).toBeFalsy();
        if ( err )
          return done();
        db.onerror = function(event) {
          // don't expect any errors to bubble up
          expect('db.onerror').toBe('never called');
          expect(event.target.error).toBeNull();
          return done();
        };
        var dataset = [];
        db.transaction().objectStore('data').index('count')
          .openCursor(scope.IDBKeyRange.bound(3, 15))
          .onsuccess = function(event) {
            var cursor = event.target.result;
            if ( cursor )
            {
              dataset.push(cursor.value.id + ':' + cursor.value.value);
              return cursor.continue();
            }
            dataset.sort()
            expect(dataset).toEqual(['1:foo1', '3:zapper']);
            done();
          };
      });
    });

    //-------------------------------------------------------------------------
    it('supports IDBKeyRange.bound() (lower-open) operation', function(done) {
      createTestDb(function(err, db, scope) {
        expect(err).toBeFalsy();
        if ( err )
          return done();
        db.onerror = function(event) {
          // don't expect any errors to bubble up
          expect('db.onerror').toBe('never called');
          expect(event.target.error).toBeNull();
          return done();
        };
        var dataset = [];
        db.transaction().objectStore('data').index('count')
          .openCursor(scope.IDBKeyRange.bound(3, 15, true))
          .onsuccess = function(event) {
            var cursor = event.target.result;
            if ( cursor )
            {
              dataset.push(cursor.value.id + ':' + cursor.value.value);
              return cursor.continue();
            }
            dataset.sort()
            expect(dataset).toEqual(['3:zapper']);
            done();
          };
      });
    });

    //-------------------------------------------------------------------------
    it('supports IDBKeyRange.bound() (upper-open) operation', function(done) {
      createTestDb(function(err, db, scope) {
        expect(err).toBeFalsy();
        if ( err )
          return done();
        db.onerror = function(event) {
          // don't expect any errors to bubble up
          expect('db.onerror').toBe('never called');
          expect(event.target.error).toBeNull();
          return done();
        };
        var dataset = [];
        db.transaction().objectStore('data').index('count')
          .openCursor(scope.IDBKeyRange.bound(3, 15, false, true))
          .onsuccess = function(event) {
            var cursor = event.target.result;
            if ( cursor )
            {
              dataset.push(cursor.value.id + ':' + cursor.value.value);
              return cursor.continue();
            }
            dataset.sort()
            expect(dataset).toEqual(['1:foo1']);
            done();
          };
      });
    });

    //-------------------------------------------------------------------------
    it('supports IDBKeyRange.bound() (open) operation', function(done) {
      createTestDb(function(err, db, scope) {
        expect(err).toBeFalsy();
        if ( err )
          return done();
        db.onerror = function(event) {
          // don't expect any errors to bubble up
          expect('db.onerror').toBe('never called');
          expect(event.target.error).toBeNull();
          return done();
        };
        var dataset = [];
        db.transaction().objectStore('data').index('count')
          .openCursor(scope.IDBKeyRange.bound(3, 15, true, true))
          .onsuccess = function(event) {
            var cursor = event.target.result;
            if ( cursor )
            {
              dataset.push(cursor.value.id + ':' + cursor.value.value);
              return cursor.continue();
            }
            dataset.sort()
            expect(dataset).toEqual([]);
            done();
          };
      });
    });

    //-------------------------------------------------------------------------
    it('maintains the `Database.objectStoreNames` attribute', function(done) {
      createTestDb(function(err, db, scope) {
        expect(err).toBeFalsy();
        if ( err )
          return done();
        expect(db.version).toEqual(1);
        expect(db.objectStoreNames).toEqual(['data', 'longdata']);
        db.close();
        var req = scope.indexedDB.open(testDbName, 2);
        req.onerror = makeErrorHandler('objectStoreNames', 'open.error', done);
        req.onblocked = makeErrorHandler('objectStoreNames', 'open.blocked', done);
        req.onupgradeneeded = function(event) {
          db = event.target.result;
          db.deleteObjectStore('longdata');
        };
        req.onsuccess = function(event) {
          db = event.target.result;
          expect(db.version).toEqual(2);
          expect(db.objectStoreNames).toEqual(['data']);
          // make sure that a "fresh" open maintains this info...
          db.close();
          var req = scope.indexedDB.open(testDbName, 2);
          req.onerror = makeErrorHandler('objectStoreNames', 'open2.error', done);
          req.onblocked = makeErrorHandler('objectStoreNames', 'open2.blocked', done);
          req.onupgradeneeded = makeErrorHandler('objectStoreNames', 'open2.onupgradeneeded', done);
          req.onsuccess = function(event) {
            db = event.target.result;
            expect(db.version).toEqual(2);
            expect(db.objectStoreNames).toEqual(['data']);
            done();
          };
        };
      });      
    });

    //-------------------------------------------------------------------------
    it('runs the example program from the documentation', function(done) {

      // TODO: it would be *great* if i could auto-extract the
      // example from README.md instead of needing to duplicate it here...

      var output = '';
      var _console = console;
      var console = {
        log: function(msg) {
          output += msg + '\n';
        }
      }
      var final_check = function() {
        expect(output).toEqual(
          'record: {"id":1,"value":"my-first-item"}\n'
            + 'deleted the record\n'
            + 'added two more records\n'
            + 'all objects with the "value" field set to "another object":\n'
            + '  - {"id":"2","value":"another object"}\n'
            + '  - {"id":3,"value":"another object"}\n'
        );
        done();
      };


var engine    = new sqlite3.Database(':memory:');
var scope     = indexeddbjs.makeScope('sqlite3', engine);
var request   = scope.indexedDB.open('MyDatabase');
var db        = null;

request.onerror = function(event) {
  console.log('ERROR: could not open database: ' + event.target.error);
  done();
};

request.onupgradeneeded = function(event) {
  db = event.target.result;
  var store = db.createObjectStore('data', {keyPath: 'id'});
  store.createIndex('value', 'value', {unique: false});
  store.add({id: 1, value: 'my-first-item'});
};

request.onsuccess = function(event) {
  db = event.target.result;
  request.run();
};

request.run = function() {

  // register an error handler for any error on the current db
  db.onerror = function(event) {
    console.log('DATABASE ERROR: ' + event.target.error);
  };

  // fetch the record with id "1" in store "data"
  var store = db.transaction(null, 'readwrite').objectStore('data');
  store.get('1').onsuccess = function(event) {
    var obj = event.target.result;
    console.log('record: ' + JSON.stringify(obj));

    // now delete it
    store.delete('1').onsuccess = function(event) {
      console.log('deleted the record');

      // and now add a couple new records (overwriting it if the key
      // already exists) with the same 'value' (so we can play with cursors)
      store.put({id: '2', value: 'another object'}).onsuccess = function(event) {
        store.put({id: 3, value: 'another object'}).onsuccess = function(event) {
          console.log('added two more records');

          // we're getting pretty deeply nested here... let's pop out
          // and use the index
          play_with_the_index_and_cursors();

        };
      };
    };
  };

  var play_with_the_index_and_cursors = function() {

    var index = db.transaction(null, 'readwrite').objectStore('data').index('value');
    var range = scope.IDBKeyRange.only('another object');

    console.log('all objects with the "value" field set to "another object":');

    index.openCursor(range).onsuccess = function(event) {
      var cursor = event.target.result;
      if ( ! cursor )
        return final_check();

      console.log('  - ' + JSON.stringify(cursor.value));
      cursor.continue();
    };

  };

};

    });

  });
});

//-----------------------------------------------------------------------------
// end of $Id$
//-----------------------------------------------------------------------------
