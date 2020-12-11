
const twilio = require('twilio');
exports.handler = async function(event: any) {
  const body = JSON.parse(event.body);
  const { owner, participantsList, dateOfExchange } = body;
  for (let i = participantsList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [participantsList[i], participantsList[j]] = [participantsList[j], participantsList[i]];
  }
  const auth = JSON.parse(process.env.auth as string);
  const { accountID, secretID, secretPassword } = auth;
  const client = twilio(secretID, secretPassword, { accountSid: accountID });

  const textMessagePromises = participantsList.map(({ name, phone}: any, index: any) => {
    const nextPerson = participantsList[index+1] ? participantsList[index+1] : participantsList[0];
    return client.messages
      .create({
         body: `Hi ${name}!! you have been invited to participate in a secret santa!!!! The organizer of this is ${owner}, your person is ${nextPerson.name} and if you want to mail them a gift then their address is ${nextPerson.address}. Please be ready by this date ${dateOfExchange}`,
         from: '+16172096841',
         to: phone
      });
  });
  try {
    await Promise.all(textMessagePromises);
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*',},
      body: `ok`
    };
  }
  catch(err) {
    console.log(err);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*',},
      body: `ok`
    };
  }
};