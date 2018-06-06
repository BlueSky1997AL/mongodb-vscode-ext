# mongodb-memory-server

[![travis build](https://img.shields.io/travis/nodkz/mongodb-memory-server.svg)](https://travis-ci.org/nodkz/mongodb-memory-server)
[![NPM version](https://img.shields.io/npm/v/mongodb-memory-server.svg)](https://www.npmjs.com/package/mongodb-memory-server)
[![Downloads stat](https://img.shields.io/npm/dt/mongodb-memory-server.svg)](http://www.npmtrends.com/mongodb-memory-server)
[![Travis](https://img.shields.io/travis/nodkz/mongodb-memory-server.svg?maxAge=2592000)](https://travis-ci.org/nodkz/mongodb-memory-server)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Greenkeeper badge](https://badges.greenkeeper.io/nodkz/mongodb-memory-server.svg)](https://greenkeeper.io/)

This package spins up a actual/real MongoDB Server programmatically from node for testing or mocking during development. By default it holds the data in memory. Fresh spinned up `mongod` process takes about 7Mb of memory. The server will allow you to connect your favorite ODM or client library to the MongoDB Server and run integration tests isolated from each other.

This package on first start downloads the latest MongoDB binaries and save it to `~/.mongodb-binaries` folder. So first run may take a time. All further runs will fast, because use already downloaded binaries.

Every `MongodbMemoryServer` instance creates and starts fresh MongoDB server on some free port. You may start up several mongod simultaneously. When you terminate your script or call `stop()` MongoDB server(s) will be automatically shutdown.

Perfectly [works with Travis CI](https://github.com/nodkz/graphql-compose-mongoose/commit/7a6ac2de747d14281f9965f418065e97a57cfb37) without additional `services` and `addons` options in `.travis.yml`.

## Installation
```
yarn add mongodb-memory-server --dev
OR
npm install mongodb-memory-server --save-dev
```

## Usage

### Simple server start:
```js
import MongodbMemoryServer from 'mongodb-memory-server';

const mongod = new MongodbMemoryServer();

const uri = await mongod.getConnectionString();
const port = await mongod.getPort();
const dbPath = await mongod.getDbPath();
const dbName = await mongod.getDbName();

// some code

// you may stop mongod manually
mongod.stop();
// or it will be stopped automatically when you exit from script
```

### Available options
All options are optional.
```js
const mongod = new MongodbMemoryServer({
  instance: {
    port?: ?number, // by default choose any free port
    dbName?: string, // by default generate random dbName
    dbPath?: string, // by default create in temp directory
    storageEngine?: string, // by default `ephemeralForTest`
    debug?: boolean, // by default false
  },
  binary: {
    version?: string, // by default '3.4.4'
    downloadDir?: string, // by default %HOME/.mongodb-binaries
    platform?: string, // by default os.platform()
    arch?: string, // by default os.arch()
    debug?: boolean, // by default false
  },
  debug?: boolean, // by default false
  autoStart?: boolean, // by default true
});
```

### Simple test with MongoClient

Take a look at this [test file](https://github.com/nodkz/mongodb-memory-server/blob/master/src/__tests__/singleDB-test.js).

### Provide connection string to mongoose
```js
import mongoose from 'mongoose';
import MongodbMemoryServer from 'mongodb-memory-server';

const mongoServer = new MongodbMemoryServer();

mongoose.Promise = Promise;
mongoServer.getConnectionString().then((mongoUri) => {
  const mongooseOpts = { // options for mongoose 4.11.3 and above
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
    useMongoClient: true, // remove this line if you use mongoose 5 and above
  };

  mongoose.connect(mongoUri, mongooseOpts);

  mongoose.connection.on('error', (e) => {
    if (e.message.code === 'ETIMEDOUT') {
      console.log(e);
      mongoose.connect(mongoUri, mongooseOpts);
    }
    console.log(e);
  });

  mongoose.connection.once('open', () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });
});
```
For additional information I recommend you to read this article [Testing a GraphQL Server using Jest with Mongoose](https://medium.com/entria/testing-a-graphql-server-using-jest-4e00d0e4980e)


### Several mongoose connections simultaneously
```js
import mongoose from 'mongoose';
import MongodbMemoryServer from 'mongodb-memory-server';

mongoose.Promise = Promise;

const mongoServer1 = new MongodbMemoryServer();
const mongoServer2 = new MongodbMemoryServer();

// Firstly create connection objects, which you may import in other files and create mongoose models.
// Connection to databases will be estimated later (after model creation).
const connections = {
  conn1: mongoose.createConnection(),
  conn2: mongoose.createConnection(),
  conn3: mongoose.createConnection(),
};

const mongooseOpts = { // options for mongoose 4.11.3 and above
  promiseLibrary = Promise;
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  useMongoClient: true, // remove this line if you use mongoose 5 and above
};

mongoServer1.getConnectionString('server1_db1').then((mongoUri) => {
  connections.conn1.open(mongoUri, mongooseOpts);
  connection.once('open', () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });
});

mongoServer1.getConnectionString('server1_db2').then((mongoUri) => {
  connections.conn2.open(mongoUri, mongooseOpts);
  connection.once('open', () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });
});

mongoServer2.getConnectionString('server2_db').then((mongoUri) => {
  connections.conn3.open(mongoUri, mongooseOpts);
  connection.once('open', () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });
});

export default connections;


// somewhere in other file
import { Schema } from 'mongoose';
import { conn1, conn2, conn3 } from './file_above';

const userSchema = new Schema({
  name: String,
});

const taskSchema = new Schema({
  userId: String,
  task: String,
});

export default {
  User: conn1.model('user', userSchema),
  Task: conn2.model('task', taskSchema),
  UserOnServer2: conn3.model('user', userSchema),
}
```

Note: When you create mongoose connection manually, you should do:
```js
import mongoose from 'mongoose';

const opts = { useMongoClient: true }; // remove this option if you use mongoose 5 and above
const conn = mongoose.createConnection(); // just create connection instance
const User = conn.model('User', new mongoose.Schema({ name: String })); // define model
conn.open(uri, opts); // open connection to database (NOT `connect` method!)
```
With default connection:
```js
import mongoose from 'mongoose';

const opts = { useMongoClient: true }; // remove this option if you use mongoose 5 and above
mongoose.connect(uri, opts);
const User = mongoose.model('User', new mongoose.Schema({ name: String })); // define model
```



### Simple Mocha/Chai test example

Start Mocha with `--timeout 60000` cause first download of MongoDB binaries may take a time.

```js
import mongoose from 'mongoose';
import MongodbMemoryServer from 'mongodb-memory-server';

let mongoServer;
const opts = { useMongoClient: true }; // remove this option if you use mongoose 5 and above

before((done) => {
  mongoServer = new MongodbMemoryServer();
  mongoServer.getConnectionString().then((mongoUri) => {
    return mongoose.connect(mongoUri, opts, (err) => {
      if (err) done(err);
    });
  }).then(() => done());
});

after(() => {
  mongoose.disconnect();
  mongoServer.stop();
});

describe('...', () => {
  it("...", async () => {
    const User = mongoose.model('User', new mongoose.Schema({ name: String }));
    const cnt = await User.count();
    expect(cnt).to.equal(0);
  });
});
```

### Simple Jest test example
```js
import mongoose from 'mongoose';
import MongodbMemoryServer from 'mongodb-memory-server';

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

let mongoServer;
const opts = { useMongoClient: true }; // remove this option if you use mongoose 5 and above

beforeAll(async () => {
  mongoServer = new MongodbMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  await mongoose.connect(mongoUri, opts, (err) => {
    if (err) console.error(err);
  });
});

afterAll(() => {
  mongoose.disconnect();
  mongoServer.stop();
});

describe('...', () => {
  it("...", async () => {
    const User = mongoose.model('User', new mongoose.Schema({ name: String }));
    const cnt = await User.count();
    expect(cnt).toEqual(0);
  });
});
```

Additional examples of Jest tests:
- simple example with `mongodb` in [tests in current package](https://github.com/nodkz/mongodb-memory-server/blob/master/src/__tests__/)
- more complex example with `mongoose` in [graphql-compose-mongoose](https://github.com/nodkz/graphql-compose-mongoose/blob/master/src/__mocks__/mongooseCommon.js)

### AVA test runner
For AVA written [detailed tutorial](https://github.com/zellwk/ava/blob/8b7ccba1d80258b272ae7cae6ba4967cd1c13030/docs/recipes/endpoint-testing-with-mongoose.md) how to test mongoose models by @zellwk.


## Travis
You may cache downloaded MongoDB binaries on Travis to speed up further tests:
```yml
cache:
  directories:
    - $HOME/.mongodb-binaries
```

**Also it is very important** to limit spawned number of Jest workers for avoiding race condition. Cause Jest spawn huge amount of workers for every node environment on same machine. [More details](https://github.com/facebook/jest/issues/3765)
Use `--maxWorkers 4` or `--runInBand` option.
```diff
script:
-  - yarn run coverage
+  - yarn run coverage -- --maxWorkers 4
```

## Credits
Inspired by alternative runners for [mongodb-prebuilt](https://github.com/winfinit/mongodb-prebuilt):
- [mockgoose](https://github.com/mockgoose/Mockgoose)
- [mongomem](https://github.com/CImrie/mongomem)

## License

MIT
