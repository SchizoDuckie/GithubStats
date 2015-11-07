/**
 * These are the entity mappings (ActiveRecord / ORM objects) for GithubStats.
 * There's an object for each database table where information is stored.
 * These are all based on CreateReadUpdateDelete.js : http://schizoduckie.github.io/CreateReadUpdateDelete.js
 * CRUD.JS creates automatic SQL queries from these objects and handles relationships between them.
 * It also provides the automatic execution of the create statements when a database table is not available.
 */

function Project() {
    CRUD.Entity.call(this);
}

var Project = CRUD.define({
    className: 'Project',
    table: 'Project',
    primary: 'ID_Project',
    fields: ['ID_Project', 'username', 'repository', 'lastUpdated'],
    createStatement: 'CREATE TABLE Project ( ID_Project INTEGER PRIMARY KEY NOT NULL, username VARCHAR(250) NOT NULL,  repository VARCHAR(250) NOT NULL, lastUpdated timestamp NULL)',
    adapter: 'dbAdapter',
    relations: {
        'Stats': CRUD.RELATION_FOREIGN
    },
}, {
    getStats: function() {
        return CRUD.Find(Stats, {ID_Project: this.getID()});
    },
    getLatestStats: function() {
        return CRUD.Find(Stats, {ID_Project: this.getID()}).then(function(results) {
            return results.sort(function(a,b) {
                return a.pointInTime < b.pointInTime;
            });
        });
    }
});


var Stats = CRUD.define({
    className: 'Stats',
    table: 'Stats',
    primary: 'ID_Statistic',
    fields: ['ID_Statistic', 'ID_Project', 'pointInTime', 'json'],
    createStatement: 'CREATE TABLE Stats ( ID_Statistic INTEGER PRIMARY KEY NOT NULL, ID_Project INTEGER NOT NULL, pointInTime timestamp NOT NULL, json TEXT NOT NULL)',
    adapter: 'dbAdapter',
    relations: {
        'Project': CRUD.RELATION_FOREIGN
    },
}, {
});


CRUD.DEBUG = false;

CRUD.setAdapter(new CRUD.SQLiteAdapter('githubstats'));