const axios = require("axios");
const crypto = require("crypto");

let alphanumeric = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z"
];

const DEFAULTS = {
  salt: "salt",
  iterations: 300000,
  size: 32,
  hash: "sha512"
};

function pbkdf2({ cookie, salt, iterations, size, hash } = DEFAULTS) {
  iterations = +iterations;
  size = +size;
  salt = salt ? salt : DEFAULTS.salt;
  iterations = iterations > 0 ? iterations : DEFAULTS.iterations;
  size = size > 0 ? size : DEFAULTS.size;
  hash = crypto.getHashes().includes(hash) ? hash : DEFAULTS.hash;
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(cookie, salt, iterations, size, hash, (err, key) =>
      err
        ? reject(Error(`Failed to generate a key with error: ${err}`))
        : resolve(key)
    );
  });
}

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
async function main() {
  let plaintext = "012345678901234";
  let cookie = "";
  let a = 0;

  while (a < 16) {
    let data0 = await queryCryptoOracle({
      plaintext: plaintext
    });

    let { ciphertext } = data0;

    ctxt_sliced = ciphertext.slice(0, 16);
    //console.log("prvi sliciani" + ctxt_sliced);

    for (let i = 16 - plaintext.length; i > 0; i--) {
      let newptxt = plaintext;
      for (let j = 0; j < cookie.length; j++) {
        newptxt += cookie[j];
      }

      for (let k = 0; k < alphanumeric.length; k++) {
        let data = await queryCryptoOracle({
          plaintext: newptxt + alphanumeric[k]
        });

        let ciphertext1 = data.ciphertext;
        ctxt_sliced1 = ciphertext1.slice(0, 16);
        //console.log("drugi sliciani: " + ctxt_sliced1);
        if (ctxt_sliced == ctxt_sliced1) {
          cookie += alphanumeric[k];

          break;
        }
      }
      if (cookie.length == 16 - plaintext.length) {
        break;
      }
    }
    plaintext = plaintext.slice(0, plaintext.length - 1);
    a++;
  }
  //console.log(cookie);
  const mode = "aes-256-cbc";
  const iv = Buffer.from("5b073675ff5ae94fdabc6a983605d3a3", "hex");
  const key = await pbkdf2({ cookie: cookie });

  const myciphertxt =
    "832b493b7a84b84c6762a39bdfdcdb97070afa3fcdf5e25667749fdcd2c1f8e2cc349bc96d1bf1e85ff8f39d7564a0c0";
  const decipher = crypto.createDecipheriv(mode, key, iv);
  decipher.setAutoPadding(true);
  let plaintext_end = decipher.update(myciphertxt, "hex", "utf8");
  plaintext_end += decipher.final("utf8");

  console.log("Decryptor: %o", plaintext_end);
}
main();
