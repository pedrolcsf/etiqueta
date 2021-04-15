# Etiquetas

**Para o sistema de etiquetas vamos usar as seguintes bibliotecas:**

- node-ssh
- cors
- dotenv
- express

**Vamos criar as nossas variaveis ambientes que são:**

```tsx
SSH_HOST="ip"
SSH_USER="user"
SSH_PASSWORD="password"
```

**O servidor é iniciado na porta 3337.**

**os tipos das etiquetas são informados na url /:printing_type**

**os seguintes parâmetros são obrigatórios**: code, type, description

Se todos os requisitos passarem ele cria uma conexão com a **Raspberry Pi,** muda o código **epl2** de acordo com os parâmetros inseridos anteriormente, em seguida manda o código epl para a impressora:

```bash
echo "código epl" > /dev/usb/lp0
```

**obs: se você não tiver permissão adicione o seu usuário ao grupo lp**

```bash
sudo adduser "usuario" lp
```

[Entendendo o Código EPL](Etiquetas%20e4f3d5647cba4635baa967bc5c83eb0b/Entendendo%20o%20Co%CC%81digo%20EPL%203d9c1c5523ac405db3cd32e5d9222336.md)