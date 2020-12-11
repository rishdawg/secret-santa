exports.handler = async function(event: any) {
  const body = JSON.parse(event.body);
  const { owner, participantsList, dateOfExchange } = body;
  for (let i = participantsList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [participantsList[i], participantsList[j]] = [participantsList[j], participantsList[i]];
  }
  const auth = JSON.parse(process.env.auth as string);
  const { accountID, secretID, secretPassword } = auth;
  console.log(participantsList);
  const client = require('twilio')(secretID, secretPassword, { accountSid: accountID });
  console.log(client);

  participantsList.forEach(({ name, phone}: any, index: any) => {
    const nextPerson = participantsList[index+1] ? participantsList[index+1] : participantsList[0];
    client.messages
      .create({
         body: `Hi ${name}!! you have been invited to participate in a secret santa!!!! The organizer of this is ${owner}, your person is ${nextPerson.name} and if you want to mail them a gift then their address is ${nextPerson.address}. Please be ready by this date ${dateOfExchange}`,
         from: '+16172096841',
         to: phone
      })
      .then((message: any) => console.log(message.sid));
  });

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*',},
    body: `ok`
  };
};