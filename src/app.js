//* ************************************************************************** */
//* ***************************** LIBRARIES ********************************** */
//* ************************************************************************** */
const { NodeSSH } = require('node-ssh');
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/sample.db');
require('dotenv').config();
//* ************************************************************************** */
const app = express();
app.use(cors());
app.use(express.json());

//* ************************************************************************** */

//* ************************************************************************** */
//* ********************************* ROTAS ********************************** */
//* ************************************************************************** */
app.post('/:printing_type', (req, res) => {
  const { printing_type } = req.params;

  // query params
  let {
    code, type, description, code_loc, go,
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

  const ssh = new NodeSSH();
  var epl = 'N\n';

  // case print_type
  switch (printing_type) {
    case '2':
      if (go == 1) {
        epl = `A452,6,0,4,0,1,N,"Cd:${code.substring(0, 18)}"\nA452,35,0,4,0,1,N,"Tipo:${type.substring(0, 18)}"\nA452,64,0,4,0,1,N,"Desc:${description.substring(0, 18)}"\n${description.length > 18 ? `A452,93,0,4,0,1,N,"${description.substring(18, 42)}"\nA452,122,0,4,0,1,N,"Loc:${code_loc.substring(0, 18)}"\n` : `A452,93,0,4,0,1,N,"Loc:${code_loc.substring(0, 18)}"\n`}`;

        ssh.connect({
          host: process.env.SSH_HOST,
          username: process.env.SSH_USER,
          password: process.env.SSH_PASSWORD,
        }).then(() => {
          ssh.execCommand(`echo 'N\n${epl}P1' > /dev/usb/lp0`);

          res.status(200).json({ message: 'successfully printed' });
        });
      } else {
        // Fila
        epl = `A20,6,0,4,0,1,N,"Cd:${code.substring(0, 18)}"\nA20,35,0,4,0,1,N,"Tipo:${type.substring(0, 18)}"\nA20,64,0,4,0,1,N,"Desc:${description.substring(0, 18)}"\n${description.length > 18 ? `A20,93,0,4,0,1,N,"${description.substring(18, 42)}"\nA20,122,0,4,0,1,N,"Loc:${code_loc.substring(0, 18)}"\n` : `A20,93,0,4,0,1,N,"Loc:${code_loc.substring(0, 18)}"\n`}`;
        db.run('CREATE TABLE etiqueta(etiquetas)');
        db.close();
      }
      break;
    case '3':
      const epl1 = `N\n\nA20,5,0,3,1,1,N,"${code}"\nA20,27,0,3,1,1,N,"${type}"\nA20,49,0,3,1,1,N,"${description}"\nA20,71,0,3,1,1,N,"${code_loc}"\nP1`;
      const epl2 = `N\n\nA285,5,0,3,1,1,N,"${code}"\nA285,27,0,3,1,1,N,"${type}"\nA285,49,0,3,1,1,N,"${description}"\nA285,71,0,3,1,1,N,"${code_loc}"\nP1`;
      const epl3 = `N\n\nA550,5,0,3,1,1,N,"${code}"\nA550,27,0,3,1,1,N,"${type}"\nA550,49,0,3,1,1,N,"${description}"\nA550,71,0,3,1,1,N,"${code_loc}"\nP1`;

      epl = `N\n\nA20,5,0,3,1,1,N,"${code}"\nA20,27,0,3,1,1,N,"${type}"\nA20,49,0,3,1,1,N,"${description}"\nA20,71,0,3,1,1,N,"${code_loc}"\nA285,5,0,3,1,1,N,"${code}"\nA285,27,0,3,1,1,N,"${type}"\nA285,49,0,3,1,1,N,"${description}"\nA285,71,0,3,1,1,N,"${code_loc}"\nA550,5,0,3,1,1,N,"${code}"\nA550,27,0,3,1,1,N,"${type}"\nA550,49,0,3,1,1,N,"${description}"\nA550,71,0,3,1,1,N,"${code_loc}"\nP1`;
      ssh.connect({
        host: process.env.SSH_HOST,
        username: process.env.SSH_USER,
        password: process.env.SSH_PASSWORD,
      }).then(() => {
        ssh.execCommand(`echo '${epl}' > /dev/usb/lp0`);

        res.status(200).json({ message: 'successfully printed' });
      });
      break;
    default:
      break;
  }
});

//* ************************************************************************** */
app.listen(3337, () => {
  console.log('server starded on port 3337');
});
