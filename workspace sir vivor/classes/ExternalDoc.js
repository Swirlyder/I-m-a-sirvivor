const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '../credentials.json');

function getFileContent(filePath) {
    let fileContent;
    try {
        fileContent = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error(err);
    }
    return fileContent;
}

class ExternalDoc {
    authenticateAPI() {
        const auth = new google.auth.GoogleAuth({
            keyfilePath: path.join(__dirname, 'credentials.json'),
            scopes: ['https://www.googleapis.com/auth/documents']
        });

        const docs = google.docs({ version: 'v1', auth });

        return docs;
    }

    deleteAllTextRequest(requests, endOfDoc) {
        requests.push({
            deleteContentRange: {
                range: {
                    startIndex: 1,
                    endIndex: endOfDoc - 1,
                },
            },
        });
    }

    insertTextRequest(requests, newText) {
        requests.push({
            insertText: {
                endOfSegmentLocation: {},
                text: newText,
            },
        });
    }

    doRequests(documentId, requests, docs) {
        return docs.documents.batchUpdate({
            documentId: documentId,
            requestBody: { requests },
        }).then((updateResponse) => {
                console.log(updateResponse.data);
                return updateResponse.data;
            })
    }

    copyToBackup(filePath, LbBackupdocId) {
        // authenticate service account
        const docs = this.authenticateAPI();

        // put local file's content into a string
        const newText = getFileContent(filePath);

        // return if string is empty
        if (newText === 0) return Promise.resolve(); // Return a resolved promise

        // get backup document's endIndex position
        return docs.documents.get({ documentId: LbBackupdocId })
            .then((response) => {
                const endOfDoc = response.data.body.content[1].endIndex;

                // create list of requests
                const requests = [];

                // request to delete all doc content
                this.deleteAllTextRequest(requests, endOfDoc);

                // request to insert file's content to doc
                this.insertTextRequest(requests, newText);

                // carry out requests
                return this.doRequests(LbBackupdocId, requests, docs);
            })
    }
}

module.exports = ExternalDoc;