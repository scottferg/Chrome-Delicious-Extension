// Copyright (c) 2009, William Best and Scott Ferguson
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the software nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY WILLIAM BEST AND SCOTT FERGUSON ''AS IS'' AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL WILLIAM BEST AND SCOTT FERGUSON BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/**
 * Utility function
 *
 */
function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if (typeof value.length === 'number' &&
                    !(value.propertyIsEnumerable('length')) &&
                    typeof value.splice === 'function') {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}

/**
 * Constructor for DeliciousDatabase object
 *
 */
function DeliciousDatabase() {

    // Instantiate the database
    this.database = window.openDatabase("deliciousDatabase", "0.1", "Delicious Database", 250 * 1024);

    if (!this.database) {
        console.log("Error opening database");
    }

    // Create the tables if they don't exist already
    this.database.transaction(function(query) {
        query.executeSql('CREATE TABLE tags(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(50))', []);
                         []
    });

    this.database.transaction(function(query) {
        query.executeSql('CREATE TABLE bookmarks(id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(50), url VARCHAR(250))', []);
                         []
    });

    this.database.transaction(function(query) {
        query.executeSql('CREATE TABLE tagged_bookmark(FOREIGN KEY (tag) REFERENCES tags(id), FOREIGN KEY (bookmark) REFERENCES bookmarks(id))', []);
                         []
    });

    this.database.transaction(function(query) {
        query.executeSql('CREATE TABLE settings(id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(50), password VARCHAR(50))', []);
                         []
    });

    return this;
}

/**
 * Adds a bookmark to the database.
 *
 * @param title - string Title of bookmark
 * @param url - string URL of bookmark
 * @param tags - array List of tags for bookmark
 *
 */
DeliciousDatabase.prototype.addBookmark = function(title, url, tags) {

    // If tags weren't provided, default to an empty
    // array
    tags = tags || [];

    // TODO: Only write to the database if we receive a successful response
    // from Delicious

    // Write the bookmark to the database
    this.database.transaction(function(query) {
        query.executeSql('INSERT INTO bookmarks(title, url) VALUES(?, ?)',
                         [title, url]);
    });
};

/**
 * Fetch all bookmarks
 *
 */
DeliciousDatabase.prototype.getBookmarks = function() {

    this.database.transaction(function(query) {
        query.executeSql('SELECT * FROM bookmarks', 
                         [], 
                         function(transaction, result) {
                            for (var i = 0; i < result.rows.length; i++) {
                                console.log(result.rows.item(i).title);
                            }
                         });
    }); 
};

/**
 * Method for writing out a user
 *
 * @param username - string Username
 * @param password - string Password
 *
 * TODO: This seems to make more sense as two localStorage values,
 * not database values
 */
DeliciousDatabase.prototype.setupUser = function(username, password) {

    // Type checking for parameters
    if (!(typeOf(username) == 'string'))
        console.log('ERROR: not a string');

    if (!(typeOf(password) == 'string'))
        console.log('ERROR: not a string');

    // Insert the values into the database
    this.database.transaction(function(query) {
        query.executeSql('INSERT INTO settings(username, password) VALUES(?, ?)', 
                         [username, password]);
    });
};