//* ************************************************************************** */
//* ***************************** LIBRARIES ********************************** */
//* ************************************************************************** */
const { NodeSSH } = require('node-ssh');
const express = require('express');
const cors = require('cors');

require('dotenv').config();
//* ************************************************************************** */
const app = express();
app.use(cors());
app.use(express.json());

//* ************************************************************************** */
const ssh = new NodeSSH();
//* ************************************************************************** */
//* ********************************* ROTAS ********************************** */
//* ************************************************************************** */
app.post('/:printing_type', (req, res) => {
  const { printing_type } = req.params;

  // query params
  const {
    code, type, description, code_loc,
  } = req.query;

  // tratamento de alguns erros
  if (code.length === 0 || !code) {
    res.status(401).json({ error: 'please insert the code' });
  } else if (type.length === 0 || !type) {
    res.status(401).json({ error: 'please insert the type' });
  } else if (description.length === 0 || !description) {
    res.status(401).json({ error: 'please insert the description' });
  } else if (code_loc.length === 0 || !code_loc) {
    res.status(401).json({ error: 'please insert the code_loc' });
  }

  // case print_type
  switch (printing_type) {
    case '1':
      const epl = `N\n\nA20,5,0,3,1,1,N,"${code}"\nA20,30,0,3,1,1,N,"${code}"\nP1`;

      ssh.connect({
        host: process.env.SSH_HOST,
        username: process.env.SSH_USER,
        password: process.env.SSH_PASSWORD,
      }).then(() => {
        ssh.execCommand(`echo '${epl}' > /dev/usb/lp0`);
      });

      res.status(200).json({ message: 'successfully printed' });
      break;

    default:
      break;
  }
});

//* ************************************************************************** */
app.listen(3333, () => {
  console.log('server starded on port 3333');
});
