function register(req, res) {
    console.log(req.query);
    // if parameters invalid
    if (!actions.parameterAnalyser.register(req)) {
        return actions.responseEmitter.error(103, res);
    }

    // checking if register token for this username exists
    for(var i=0; i<pendingRegisters.length; i++) {
        if ( pendingRegisters[i].username == req.query.username || pendingRegisters[i].email == req.query.email) {
            return actions.responseEmitter.error(106,res);
        }
    }

    // checking if username already exists
    db.authentication.findOne({username : req.query.username}, function(err, doc) {
        // if username found return an error
        if (doc !== null) {
            return actions.responseEmitter.error(100,res);
        }

        // checking if email exists
        db.authentication.findOne({email : req.query.email}, function(err, doc) {
            // if email found return an error
            if (doc !== null) {
                return actions.responseEmitter.error(104,res);
            }

            // creating a register token
            var registerToken = Math.floor(new Date().getTime() + (Math.random() * 10000) * (Math.random() * 10000));

            // creating a pending register entry
            var pendingRegisterEntry = {
                username : req.query.username,
                password : req.query.password,
                email : req.query.email,
                registerToken : registerToken
            };

            // appending pending registrations array
            pendingRegisters.push(pendingRegisterEntry);

            // setting function to delete register entry
            setTimeout(function() {
                for(var i=0; i<pendingRegisters.length; i++) {
                    if (pendingRegisters[i].username == pendingRegisterEntry.username) {
                        pendingRegisters.splice(i, 1);
                        return;
                    }
                }
            }, config.registrationTokenLife * 3600000);

            // sending an email with a link to complete registration
            actions.mailer.sendMail(
                req.query.email,

                "Complete Registration",

                "Please visit this link to complete registration  " +
                "http://" + config.ip + ":" + config.port.toString() +
                "/completeRegister?token=" + registerToken.toString()
            );

            // responding OK
            actions.responseEmitter.okay(res);
        });
    });
}

module.exports = register;
