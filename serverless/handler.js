// https://dev.to/adnanrahic/building-a-serverless-contact-form-with-aws-lambda-and-aws-ses-4jm0

const aws = require('aws-sdk');
const ses = new aws.SES();
const myEmail = process.env.EMAIL;
const myDomain = process.env.DOMAIN;

function generateResponse(code, payload) {
	return {
		statusCode: code,
		headers: {
			'Access-Control-Allow-Origin': myDomain,
			'Access-Control-Allow-Headers': 'x-requested-with',
			'Access-Control-Allow-Credentials': true,
		},
		body: JSON.stringify(payload),
	};
}

function generateError(code, err) {
	console.log(err);
	return {
		statusCode: code,
		headers: {
			'Access-Control-Allow-Origin': myDomain,
			'Access-Control-Allow-Headers': 'x-requested-with',
			'Access-Control-Allow-Credentials': true,
		},
		body: JSON.stringify(err.message),
	};
}

function generateEmailParams(body) {
	const { email, name, message } = JSON.parse(body);
	if (!(email && name && message)) {
		throw new Error(
			"Missing parameters! Make sure to add parameters 'email', 'name', 'message'."
		);
	}

	return {
		Source: myEmail,
		Destination: { ToAddresses: [myEmail] },
		ReplyToAddresses: [email],
		Message: {
			Body: {
				Text: {
					Charset: 'UTF-8',
					Data: `Message sent from email ${email} by ${name}: \n ${message}`,
				},
			},
			Subject: {
				Charset: 'UTF-8',
				Data: `${myDomain}: message from contact form!`,
			},
		},
	};
}

module.exports.send = async event => {
	try {
		const emailParams = generateEmailParams(event.body);
		const data = await ses.sendEmail(emailParams).promise();
		return generateResponse(200, data);
	} catch (err) {
		return generateError(500, err);
	}
};
