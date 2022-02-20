const { writeFile } = require('fs');

const path = './environment/environment.js'
const content = `
const environment = {
    username: 'ashishgopalhattimare',
    password: 'bdG8IvYprz9KiObs'
}
module.exports = environment;
`;
  
// write the content to the respective file
writeFile(path, content, (error) => {
    if (error) {
        console.log(error);
    }
    console.log(`Wrote variables to ${path}`);
    console.log(`wrote content to ${content}`);
});