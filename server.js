const express = require('express');
const bodyParser = require('body-parser');
const googleSheets = require('gsa-sheets');

const key = require('./privateSettings.json');

// TODO(you): Change the value of this string to the spreadsheet id for your
// GSA spreadsheet. See HW5 spec for more information.
const SPREADSHEET_ID = '1wqdYUlfYVKpbupPfHBnysolozvpaqV8cEbiNxXJUDko';

const app = express();
const jsonParser = bodyParser.json();
const sheet = googleSheets(key.client_email, key.private_key, SPREADSHEET_ID);

app.use(express.static('public'));

async function onGet(req, res) {

    const result = await sheet.getRows();
    const rows = result.rows;
    console.log(rows);
    console.log(rows[0][0] + "   " + rows[0][1]);
    // TODO(you): Finish onGet.
    var Rowarray = [];
    var obj = {};
    for (let i = 1; i < rows.length; i++) {
        obj = {[rows[0][0].toString()]: rows[i][0].toString(), [rows[0][1].toString()]: rows[i][1].toString()};
        Rowarray.push(obj);
    }
    console.log(Rowarray);

    res.json(Rowarray);
}

app.get('/api', onGet);


async function onPost(req, res) {
    const messageBody = req.body;

    // TODO(you): Implement onPost.
    console.log(messageBody.email);
    console.log(messageBody.name);

    sheet.appendRow([messageBody.name,messageBody.email]);
    res.json({"response": "success"});
}

app.post('/api', jsonParser, onPost);

async function onPatch(req, res) {
    const column = req.params.column;
    const value = req.params.value;
    const messageBody = req.body;

    // TODO(you): Implement onPatch.

    res.json({status: 'unimplemented'});
}

app.patch('/api/:column/:value', jsonParser, onPatch);

async function onDelete(req, res) {
    const column = req.params.column;
    const value = req.params.value;
    const result = await sheet.getRows();
    const rows = result.rows;
    console.log(column);
    console.log(value);
    // TODO(you): Implement onDelete.

    var colIndex=-1;
    var deleteIndex=-1;
    for(let i=0;i<rows[0].length;i++){
        if(rows[0][i]==column){
            colIndex=i;
            break;
        }
    }

    if(colIndex===-1){
        console.log("column not match");
        res.json({response: 'success'});
    }
    else {
        for(let i=1;i<rows.length;i++){
            if(rows[i][colIndex]==value){
                console.log(rows[i]);
                deleteIndex=i;
                break;
            }
        }
        if(deleteIndex==-1){
            console.log("value not match");
            res.json({response: 'success'});
        }
        else {
            const deleterow = await sheet.deleteRow(deleteIndex);
            res.json({response: 'success'});
        }
    }
}

app.delete('/api/:column/:value', onDelete);


// Please don't change this; this is needed to deploy on Heroku.
const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log(`Server listening on port ${port}!`);
});
