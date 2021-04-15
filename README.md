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

# Entendendo o Código EPL

**Estrutura do EPL**

```bash
Início<LF>
           N<LF>
           Configuração
           Impressão – Tipo / Onde / Dados
    Final
    Pn<LF>
```

**Principais comandos de configuração**

**S – Speed** 🚄

```bash
Sn<LF> - define a velocidade de impressão

n – velocidade de impressão em pol/seg
```

**D – Darkness** 🕶️

```bash
Dn<LF> - define a temperatura de impressão

n – temperatura (0-15)
```

**Q – Label Length**

```bash
Qp1,p2+p3<LF> – define comprimento da etiqueta e configuração do sensor

p1 – comprimento da etiqueta em pontos

p2 – comprimento do espaço/marca

Bp2 – para marca preta

0 – para papel contínuo

p3 – offset da marca
```

**Z – Print direction**

```bash
Zp1<LF> – define a direção de impressão

T – imprime a partir do Topo

B – imprime a partir da Base
```

**U – Config Label**

```bash
U<LF> - imprime a etiqueta de configuração
```

**O – Hardware Options**

```bash
OD – Direct Thermal

Od – Thermal Transfer

O – desabilita todas as opções

OC – Cutter

OS – Reverte o sensor de gap
```

```bash
^default
  Retorna a impressora para os valores de fábrica
  Suportado por firmware acima de 4.30
```

**Principais Comandos de Impressão**

**A – Campo de texto**

```bash
Ap1,p2,p3,p4,p5,p6,p7,”Data”<LF>
  p1 – posição eixo X em pontos
  p2 – posição eixo Y em pontos
  p3 – rotação (0->normal,1->90graus,2->180graus,3->270graus)
  p4 – tipo de fonte (1 a 5)
  p5 – multiplicador horizontal das fontes
  p6 – multiplicador vertical das fontes
  p7 – N-> imagem normal, ou R-> imagem em reverso
  “Data” – dados a serem impressos
```

**B – Código de barras** 

```bash
Bp1,p2,p3,p4,p5,p6,p7,p8,”Data”<LF>
  p1 – posição eixo X em pontos
  p2 – posição eixo Y em pontos
  p3 – rotação (0->normal,1->90graus,2->180graus,3->270graus)
  p4 – tipo de código de barra
  p5 – largura da barra estreita
  p6 – largura da barra larga
  p7 – altura do código de barras em pontos
  p8 – impressão da linha de interpretação (B-> sim; N-> não)
  “Data” – dados a serem impressos
```

**GK – Apagar gráficos**

```bash
GK”nome<LF> - apaga o logotipo da memória
  GM – Carregar gráfico
  GM”nome”p1<LF>”data”
  p1- tamanho do arquivo em bytes
  “data” – gráfico no formato PCX 1bit (preto-e-branco)
  GI<LF> – Imprime etiqueta com a listagem de gráficos na memória
  GG – Recupera gráfico
  GGp1,p2,”nome”<LF>
  p1 – posição no eixo x, em pontos
  p2  - posição no eixo y, em pontos
```