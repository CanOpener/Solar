/*
This file contains the cod to b executed upon the server receiving
a "start" message.
*/

function start(data, session, socket) {

    // checking if data provided is valid.
    var badData = actions.inputAN.start(data);

    if (!badData.success) {
        // emmitting error message if so
        return actions.messageEM.rejected(badData.error, socket);
    }

    //Checking if this player is already logged in.
    for (var i=0; i<loggedInPlayers.length; i++)
    {
        // if so, send rejected message with error 110
        if (data.id == loggedInPlayers[i].id) {
            return actions.messageEM.rejected(110, socket);
        }
    }

    // fetching user from AUTHENTICATION collection
    db.authentication.findOne({token : data.token, id : data.id}, function (err, authDoc) {

        if (authDoc === null) {
            // if not found return authentication error
            return actions.messageEM.rejected(106, socket);
        }

        // fetching user from PLAYERS collection
        db.players.findOne({id : data.id}, function(err, playerDoc) {

            if (playerDoc === null) {
                // if not found return authentication error
                return actions.messageEM.rejected(106, socket);
            }
            else {
                // if found load player into memmory
                session.thisPlayer = new actions.playerCS(playerDoc, socket);

                // save player to logged in players array
                loggedInPlayers.push(session.thisPlayer);

                // send accepted message
                actions.messageEM.accepted(session.thisPlayer, socket);

                // send other players message
                actions.messageEM.otherPlayers(session.thisPlayer, socket);
            }
        });
    });
}

module.exports = start;
