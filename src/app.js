// Libraries
const { NodeSSH } = require('node-ssh');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

app.post('/', (req, res) => {
  const { code, type, description } = req.query;

  if (code.length === 0 || !code) {
    res.status(401).json({ error: 'please insert the code' });
  } else if (type.length === 0 || !type) {
    res.status(401).json({ error: 'please insert the type' });
  } else if (description.length === 0 || !type) {
    res.status(401).json({ error: 'please insert the description' });
  } else {
    const ssh = new NodeSSH();
    const epl = `N\nQ5,20\nD10\nA10,0,0,2,1,1,N,"SELPROM TECNOLOGIA"\nA18,18,0,2,1,1,N,"VARZEA GRANDE - MT"\nA110,45,0,2,1,2,R,"PROTOCOLO GERAL"\nB10,95,0,1,2,4,70,B,"${code}"\nA10,194,0,1,1,1,N,"Código"\nA200,100,0,2,1,1,N,"Data: 16/07/2010"\nA200,125,0,2,1,1,N,"Horario:11:23:05"\nA200,150,0,2,1,1,N,"Resp.: Neusa"\n\nA410,0,0,2,1,1,N,"CAMARA MUNICIPAL DE"\nA418,18,0,2,1,1,N,"VARZEA GRANDE -MT"\nA510,45,0,2,1,2,R,"PROTOCOLO GERAL"\nB410,95,0,1,2,4,70,B,"2011010032"\nA410,1940,1,1,1,N,"Num.de protocolo"\nA600,100,0,2,1,1,N,"Data: 16/07/2010"\nA600,125,0,2,1,1,N,"Horario:11:23:05"\nA600,150,0,2,1,1,N,"Resp.: Neusa"\nP1`;

    ssh.connect({
      host: process.env.SSH_HOST,
      username: process.env.SSH_USER,
      password: process.env.SSH_PASSWORD,
    }).then(() => {
      ssh.execCommand(`echo '${epl}' > /dev/usb/lp0`);
    });

    res.json({ message: 'epa' });
  }
});

app.listen(3337, () => {
  console.log('server starded on port 3337');
});
