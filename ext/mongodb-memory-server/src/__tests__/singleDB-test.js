/* @flow */

import { MongoClient } from 'mongodb';
import MongoDBMemoryServer from '../MongoMemoryServer';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

let con;
let db;
let mongoServer;
beforeAll(async () => {
  mongoServer = new MongoDBMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  con = await MongoClient.connect(mongoUri);
  db = con.db(await mongoServer.getDbName());
});

afterAll(() => {
  con.close();
  mongoServer.stop();
});

describe('Single mongoServer', () => {
  it('should start mongo server', async () => {
    expect(db).toBeDefined();
    const col = db.collection('test');
    const result = await col.insert([{ a: 1 }, { b: 1 }]);
    expect(result.result).toMatchSnapshot();
    expect(await col.count({})).toBe(2);
  });
});
