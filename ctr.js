const axios = require("axios");
const crypto = require("crypto");

async function queryCryptoOracle({
  url = "http://localhost:3000/ctr",
  plaintext = "",
} = {}) {
  try {
    const response = await axios.post(url, {
      plaintext,
    });

    return response.data;
  } catch (error) {
    console.error(error.message);
  }
}
async function main() {
  const challenge = await axios.get("http://localhost:3000/ctr/challenge");
  const challenge_cipher = challenge.data.ciphertext;
  let challenge_buffer = Buffer.from(challenge_cipher, "hex");
  let i = 1;
  var plaintext = crypto.randomBytes(challenge_buffer.length);
  let my_buffer = Buffer.from(plaintext, "hex");
  let my_ptxt_hex = my_buffer.toString("hex");
  var my_ciphers = [];

  while (i > 0) {
    let data = await queryCryptoOracle({
      plaintext: my_ptxt_hex,
    });

    my_cipher = data.ciphertext;
    my_cipher_buffer = Buffer.from(my_cipher, "hex");
    if (my_ciphers.includes(my_cipher)) {
      let xor_operation = Buffer.alloc(challenge_buffer.length);

      for (var j = 0; j < xor_operation.length; j++) {
        xor_operation[j] =
          challenge_buffer[j] ^ my_cipher_buffer[j] ^ my_buffer[j];
      }

      result = xor_operation.toString("utf8").toLowerCase();

      if (result.includes("chuck norris")) {
        console.log("Vic: " + result);
        i = 0;
      } else {
        console.log("Iteration: " + i);
        i++;
      }
    }
    my_ciphers.push(my_cipher);
  }
}
main();
