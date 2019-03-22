//数据库操作
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = '3d';
const ObjectID = require('mongodb').ObjectID;
exports.ObjectID = ObjectID;

// 单条查询
exports.findOne = function (collection_name, json, callback) {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
        //assert.equal(null, err);
        //console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection(collection_name);
        collection.find(json).limit(1).toArray(function (error, docs) {
            //assert.equal(error, null);
            //console.log("Found the following records");
            //console.log(docs)
            callback(error, docs);
        });
        client.close();
    });
}

// 查询数据
exports.find=function (collection_name,json,skip,limit,sort_json,callback) {
    MongoClient.connect(url,{useNewUrlParser:true},function (err,client) {
        const db = client.db(dbName);
        const collection = db.collection(collection_name);
        collection.find(json).limit(limit).skip(skip).sort(sort_json).toArray(function (error, docs) {
            //assert.equal(error, null);
            //console.log("Found the following records");
            //console.log(docs)
            callback(error, docs);
        });
        client.close();
    });
};

// 单条插入
exports.insertOne = function (collection_name, json, callback) {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
        const db = client.db(dbName);
        const collection = db.collection(collection_name);
        collection.insertOne(json, function (error, result) {
            callback(error, result);
        });
        client.close();
    });
}

// 更新数据
exports.updateOne = function (collection_name, json_where, json_data, callback) {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
        const db = client.db(dbName);
        const collection = db.collection(collection_name);
        collection.updateOne(json_where, json_data, function (error, result) {
            //assert.equal(error, null);
            //assert.equal(1, result.result.n);
            callback(error, result);
        });
        client.close();
    });
}

// 删除数据
exports.deleteOne = function(collection_name,json,callback){
    MongoClient.connect(url,{UseNewUrlParser:true},function (err,data) {
        const db = client.db(dbName);
        const collection = db.collection(collection_name);
        collection.deleteOne(json,function (error,datas) {
            callback(error,datas);
        });
        client.close();
    });
};

// 统计
exports.count =  function(collection_name,json,callback){
    MongoClient.connect(url,{useNewUrlParser:true},function (err,client) {
        const db = client.db(dbName);
        const collection = db.collection(collection_name);
        collection.find(json).count(function (error, docs) {
            callback(error, docs);
        });
        client.close();
    });
}

// 多条数据插入
/*
 * @param db
 * @param json [{a : 1}, {a : 2}, {a : 3}]
 * @param callback
 */
exports.insertMany = function (collection_name, json, callback) {
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) {
        //assert.equal(null, err);
        //console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection(collection_name);
        collection.insertMany(json, function (error, result) {
            //assert.equal(err, null);
            //assert.equal(3, result.result.n);
            //assert.equal(3, result.ops.length);
            //console.log("Inserted " + result.ops.length + " documents into the collection");
            callback(error, result);
        });
        client.close();
    });
}

