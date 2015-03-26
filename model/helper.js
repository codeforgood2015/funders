//Helper for nodemailer to send new user validation emails to user

var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'codeforgood.funderstogether@gmail.com',
        pass: 'cfg-funders14'
    }
});

var emailNotifier = {}

//to send email to confirm that a request code has been submitted 
emailNotifier.sendNotificationtoNewUser = function (email, name, host){
	var emailOptions = {
		from: 'Funders Together ', 
		to: email, 
		subject: 'Thank you for requesting an Invitation Code',
		text: 'You have requested an Invitation Code ', 
		html: 'Hi ' + name + ', ' + '<br><br>' + 'Thank you for requesting an Invitation Code. ' +
			'We are in the middle of processing your request and will get back to you soon.' + 
			'<br><br>' + 'Thank you!' + '<br><br>' + 'Best, '+ '<br><br>' + 'Funders Together Web Team'
	};

	//send mail with defined transport object
	transporter.sendMail(emailOptions, function(error, info){
		if (error){
			console.log(error);
		}
		else{
			console.log('message sent: ' + info.response);
		}
	});
}

//to send email to let admin know that someone requested code
emailNotifier.sendNotificationtoAdmin = function (email,  requestname, host, name){
	var emailOptions = {
		from: 'Funders Together ', 
		to: email, 
		subject: requestname+' has requested an Invitation Code',
		text: 'Someone has requested an Invitation Code ', 
		html: 'Hi '+ name + ', ' + '<br><br>' + requestname+ ' has requested an Invitation Code. '+ 'Please go to ' + '<a href = ' + host + 
			'/admin/requests/>' + host + '/admin/requests/'+
			'</a> to view their request and approve or reject it.' + 
			'<br><br>' + 'Thank you!' + '<br><br>' + 'Best, '+ '<br><br>' + 'Funders Together Web Team'
	};

	//send mail with defined transport object
	transporter.sendMail(emailOptions, function(error, info){
		if (error){
			console.log(error);
		}
		else{
			console.log('message sent: ' + info.response);
		}
	});
}

//to send the accepted invitation to the user
emailNotifier.sendInvitationCode = function (email, code, name, host){
	var emailOptions = {
		from: 'Funders Together', 
		to: email, 
		subject: "Your Funders Together Invitation Code", 
		text: "Here is your Invitation Code", 
		html: 'Hi '+ name + ', ' + '<br><br>' + 'Your request for an Invitation Code '+
			'has been approved. Here is your Invitation Code: ' + code + '<br><br>' +
			'Please go to '+ '<a href = ' + host + '/form1>' + host + 
			'/form1/' + '</a> to sign up for your account.' +  '<br><br>' +
			'Thank you!' + '<br><br>' + 'Best, ' +'<br><br>' + 'Funders Together Web Team'
	};
	
	//send mail with defined transport object
	transporter.sendMail(emailOptions, function(error, info){
		if (error){
			console.log(error);
		}
		else{
			console.log('message sent: ' + info.response);
		}
	});
}

//to send email to let admin know that they've rejected/accepted someone
emailNotifier.sendDecisiontoAdmin = function (email,  requestname, decision, reqEmail){
	var emailOptions = {
		from: 'Funders Together ', 
		to: email, 
		subject: 'You have '+ decision + ' the invitation requested by ' + requestname ,
		text: 'You have ' + decision +' an Invitation Code ', 
		html: 'Hi' + ', ' + '<br><br> You have ' + decision + ' the invitation requested by ' + requestname+' ('+ reqEmail + ') ' +  
			'<br><br>' + 'Thank you!' + '<br><br>' + 'Best, '+ '<br><br>' + 'Funders Together Web Team'
	};

	//send mail with defined transport object
	transporter.sendMail(emailOptions, function(error, info){
		if (error){
			console.log(error);
		}
		else{
			console.log('message sent: ' + info.response);
		}
	});
}

//to send the declined invitation to the user
emailNotifier.sendDeclinedInvitation = function (email, name){
	var emailOptions = {
		from: 'Funders Together', 
		to: email, 
		subject: "Your Funders Together Invitation Code", 
		text: "Here is your Invitation Code", 
		html: 'Hi '+ name + ', ' + '<br><br>' + 'We are very sorry, but your request for an Invitation Code '+
			'has been declined. Please contact us for more details or please apply again.' +  '<br><br>' +
			'Thank you.' + '<br><br>' + 'Best, ' +'<br><br>' + 'Funders Together Web Team'
	};
	
	//send mail with defined transport object
	transporter.sendMail(emailOptions, function(error, info){
		if (error){
			console.log(error);
		}
		else{
			console.log('message sent: ' + info.response);
		}
	});
}

//notify user of new account created
emailNotifier.sendAccountSuccess = function (email, name, organization){
	var emailOptions = {
		from: 'Funders Together', 
		to: email, 
		subject: "Your Funders Together Account", 
		text: "Congratulations on creating your account", 
		html: 'Hi '+ name + ', ' + '<br><br>' + 'Congratulations! You have successfully created an account '+
			'on the Funders Together website. Your email ' + email +' is registered for the organization: ' + organization + 
			 '. If you believe this account was created in error, please let us know.'+ '<br><br>' +
			'Thank you and welcome to Funders Together!' + '<br><br>' + 
			'Best, ' +'<br><br>' + 'Funders Together Web Team'
	};
	
	//send mail with defined transport object
	transporter.sendMail(emailOptions, function(error, info){
		if (error){
			console.log(error);
		}
		else{
			console.log('message sent: ' + info.response);
		}
	});
}

//to send an approved invitation to the user
emailNotifier.sendInvitation = function (email, code, name, host){
	var emailOptions = {
		from: 'Funders Together', 
		to: email, 
		subject: "Your Funders Together Invitation Code", 
		text: "Here is your Invitation Code", 
		html: 'Hi '+ name + ', ' + '<br><br>' + 'You have been invited to create an account on Funders Together. '+
			'Here is your Invitation Code: ' + code + '<br><br>' +
			'Please go to '+ '<a href = ' + host + '/form1>' + host + 
			'/form1/' + '</a> to sign up for your account.' +  '<br><br>' +
			'Thank you!' + '<br><br>' + 'Best, ' +'<br><br>' + 'Funders Together Web Team'
	};
	
	//send mail with defined transport object
	transporter.sendMail(emailOptions, function(error, info){
		if (error){
			console.log(error);
		}
		else{
			console.log('message sent: ' + info.response);
		}
	});
}

//to let admin know that they've created an approved invitation
emailNotifier.sendNotetoAdmin = function (email,  requestname, reqEmail){
	var emailOptions = {
		from: 'Funders Together ', 
		to: email, 
		subject: 'You have invited ' + requestname ,
		text: 'You have created an Invitation Code ', 
		html: 'Hi' + ', ' + '<br><br> You have invited ' + requestname+' ('+ reqEmail + ') ' +  
			'<br><br>' + 'Thank you!' + '<br><br>' + 'Best, '+ '<br><br>' + 'Funders Together Web Team'
	};

	//send mail with defined transport object
	transporter.sendMail(emailOptions, function(error, info){
		if (error){
			console.log(error);
		}
		else{
			console.log('message sent: ' + info.response);
		}
	});
}

emailNotifier.resetPassword = function(user, token, host){
	var emailOptions = {
		from: 'Funders Together ', 
		to: user.email, 
		subject: 'Funders Together Password Reset Requested',
		text: 'You have requested to reset your password on Funders Together', 
		html: 'Hi ' + user.name + ', ' + '<br><br>' + 
			'You (or someone on your behalf) has requested to reset your password on Funders Together.'+ 
			'Please click on or copy and paste the following URL into your browser to reset your password: ' + 
			'<a href = "' + host + '/users/reset/' + user.resetPasswordToken + '">' + host + '/users/reset/'+ 
			user.resetPasswordToken +'</a>' + '. Note that this link will expire in an hour.' + '<br><br>' 
			+ 'If you did not request a password reset, please disregard this email and your password will remain unchanged.' +
			 '<br><br>' + 'Thank you!' + '<br><br>' + 'Best, '+ '<br><br>' + 'Funders Together Web Team'
	};
		//send mail with defined transport object
	transporter.sendMail(emailOptions, function(error, info){
		if (error){
			console.log(error);
		}
		else{
			console.log('message sent: ' + info.response);
		}
	});
}

emailNotifier.successfulReset = function(user){
	var emailOptions = {
		from: 'Funders Together ', 
		to: user.email, 
		subject: 'Funders Together Password Was Successfully Changed',
		text: 'Your password on Funders Together has been successfully changed.', 
		html: 'Hi ' + user.name + ', ' + '<br><br>' + 
			'This is a confirmation that your password has been successfully changed. '+
			'If you believe this to be an error, please email our team and we will look into this issue.'+
			 '<br><br>' + 'Thank you!' + '<br><br>' + 'Best, '+ '<br><br>' + 'Funders Together Web Team'
	};
		//send mail with defined transport object
	transporter.sendMail(emailOptions, function(error, info){
		if (error){
			console.log(error);
		}
		else{
			console.log('message sent: ' + info.response);
		}
	});
}

module.exports = emailNotifier;
