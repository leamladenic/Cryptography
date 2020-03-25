# **Kriptografija i mrežna sigurnost - Lab 2**

## ECB mode vulnerabilities

_Electronic Code Book_ (ECB) je način enkripcije poruka primjenom blok šifri kao što su DES/3DES, AES i dr. Budući da blok šifre rade s blokovima fiksne duljine (npr. AES koristi 128-bitne blokove), poruke koje su dulje od nominalne duljine bloka dane šifre enkriptiramo na način da poruku razbijemo na više blokova prije enkripcije. U ECB modu, svaki blok se zatim enkriptira/dekriptira odvojeno i neovisno od drugih blokova (vidi sliku u nastavku).

Neka je P _plaintext_ poruka duga _m_ blokova, P = P<sub>1</sub>, P<sub>2</sub>, ... , P<sub>m</sub>. U ECB modu odgovarajući _ciphertext_ dobije se kako slijedi (vidi priloženu sliku): C = C<sub>1</sub>, C<sub>2</sub>, ... , C<sub>m</sub>, uz C<sub>i</sub> = E<sub>K</sub>(P<sub>i</sub>), za i = 1...m.

<br/>
<p align="center">
<img src="../img/ecb.png" alt="ECB encryption" width="400px" height="auto"/>
<br><br>
<em>Enkripcija u ECB modu</em>
</p>
<br/>

U tekućoj vježbi pokazat ćemo da ECB mod ne osigurava povjerljivost poruke unatoč tome što koristimo siguran enkripcijski algoritam AES.

Zadatak studenta u okviru vježbe je dekriptirati tekst enkriptiran AES šifrom u CBC enkripcijskom modu. Ključ koji je potreban za dekripciju student treba otkriti u interakciji s odgovarajućim virtualnim serverom (kojeg kolokvijalno zovemo _crypto oracle_).

Šifrirani tekst student može dohvatiti konzumiranjem REST API-ja koji je dokumentiran i dostupan na studentovom virtualnom web serveru.

### Opis REST API-ja

U ovoj vježbi student će slati sljedeće HTTP zahtjeve svom _crypto oracle_-u:

```Bash
POST /ecb HTTP/1.1
plaintext = 'moj plaintext'
```

Za potrebe testiranja, ovaj REST zahtjev možete jednostavno poslati kroz sučelje Crypto Oracle API.

_Crypto oracle_ (vaš REST server) uzima vaš _plaintext_, spaja ga s tajnim _cookie_-jem, enkriptira rezultat (tj. `plaintext + cookie`) primjenom AES šifre u ECB modu tajnim 256 bitnim ključem (`aes-256-ecb`) i vraća vam odgovarajući _ciphertext_.

```Bash
{"ciphertext":"65a192c1cdf3a75c344c3535b3fccb2366c636e07094726194bc7375a09ca672"}
```

NAPOMENA: Striktno govoreći, server će enkriptirati `plaintext + cookie + padding`; `aes-256-ecb` automatski dodaje _padding_, no ovaj detalj nije toliko relevantan za rješavanje zadatka.

Kao i u prethodnoj vježbi vaš zadatak je dekriptirati vic o Chuck Norrisu. Tekst vica enkriptiran je ključem izvedenim iz tajnog _cookie_-ja (`aes-256-cbc`). Šifriran/enkriptiran tekst vica (_challenge_) možete dohvatiti kako slijedi:

```Bash
GET /ecb/challenge HTTP/1.1
```

### Kratki savjeti i korisne informacije

1. Ranjivost ECB enkripcijskog moda proizlazi iz činjnice da jednostavno možete uočiti jesu li dva _plaintext_ bloka identična tako da uspoređujete odgovarajuće _ciphertext_ blokove. Budući da se radi o determinističkoj enkripciji, isti _plaintext_ blok rezultirat će istim _ciphertext_ blokom; ako se koristi isti enkripcijski ključ (naš slučaj).

2. Iskoristite prethodnu činjnicu i pokušajte ECB _crypto oracle_-u slati različite _plaintext_ poruke. Razmislite kako bi trebali varirati testne _plaintext_ poruke da bi vam ECB _oracle_ dao potencijalno korisnu informaciju.

3. Tajni _cookie_ dug je 16 byte.

4. Koristite primitivna sredstva poput olovke i papira te pokušajte sebi skicirati ovaj problem.

Uživajte u dešifriranom vicu i podijelite ga s drugima :-) Ne zaboraite spremiti rješenja u odgovarajući repozitorij.

## Node.js _recipes_

Tehnički gledano vježbu možete rješiti i kroz sučelje Crypto Oracle API. Međutim, proces rješavnja će biti značajno spor s obzirom da trebate poslati veliki broj REST zahtjeva (~1000) vašem serveru. Stoga preporučamo da ovaj proces automatizirate u nekom programskom jeziku (Python, Java, JavaScript/Node.js, C#, C++,...).

U nastavku ćemo dati neke smjernice i pokazati neke obrasce (_pattern_) za Node.js.

### HTTP klijent `axios`

Koristite [`axios`](https://www.npmjs.com/package/axios) modul za slanje HTTP zahtjeva. Instalacija:

```bash
npm install axios
```

### Slanje HTTP zahtjeva

Modul `axios` radi asinkrone HTTP zahtjeve te vraća tzv. _promise_. Za rad s asinkronim kodom i funkcijama koristit ćemo `async/await` ključne riječi.

#### Osnovni primjer

```js
const axios = require("axios");

// define async function that returns no data
async function queryCryptoOracle() {
  const response = await axios.post("http://localhost:3000/ecb", { plaintext: "test" });
  console.log(response.data);
}

// call it
queryCryptoOracle();
```

#### Primjer 2 (vrati podatke u _promise_-u)

```js
const axios = require("axios");

//Define an async function that returns data in a promise
async function queryCryptoOracle() {
  try {
    const response = await axios.post("http://localhost:3000/ecb", {
      plaintext: "test"
    });

    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

// Await data from queryCryptoOracle() function
async function main() {
  const data = await queryCryptoOracle();
  console.log(data);
}

// Call the main function
main();
```

#### Primjer 3 (parametriziraj pozive funkcije)

```js
// Async function with optional arguments; if arguments omitted use the provided default values
async function queryCryptoOracle({
  url = "http://localhost:3000/ecb",
  plaintext = ""
} = {}) {
  try {
    const response = await axios.post(url, {
      plaintext
    });

    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}

// Multiple sequential oracle queries
async function main() {
  let data = await queryCryptoOracle({ plaintext: "test" });
  console.log(data);

  data = await queryCryptoOracle({ plaintext: "xxxxxx" });
  console.log(data);

  data = await queryCryptoOracle({
    url: "http://localhost:3000/ecb",
    plaintext: "test"
  });
  console.log(data);
}

// call the main function
main();
```

### Manipulacija JS stringovima i JSON objektima

#### Destrukturiranje JSON objekta

```js
const data = {
  ciphertext:
    "61ff4ec0ab0dea6f51ccad918d8a85f26b03de77a0c595011b57ade563ca880d66c636e07094726194bc7375a09ca672"
};

const { ciphertext } = data;
console.log(ciphertext);
```

#### Rezanje (_slicing_) stringova/nizova

```js
const data = {
  ciphertext:
    "61ff4ec0ab0dea6f51ccad918d8a85f26b03de77a0c595011b57ade563ca880d66c636e07094726194bc7375a09ca672"
};

const { ciphertext } = data;

console.log(ciphertext);
// 61ff4ec0ab0dea6f51ccad918d8a85f26b03de77a0c595011b57ade563ca880d66c636e07094726194bc7375a09ca672

console.log(ciphertext.slice(0, 32));
// 61ff4ec0ab0dea6f51ccad918d8a85f2

console.log(ciphertext.slice(0, 50));
// 61ff4ec0ab0dea6f51ccad918d8a85f26b03de77a0c595011b

console.log(ciphertext.slice(2, 5));
// ff4
```
