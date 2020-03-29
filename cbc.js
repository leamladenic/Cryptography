const axios = require("axios");
const assert = require("assert");

const MAX_32_INTEGER = Math.pow(2, 32) - 1;

async function queryCryptoOracle({
  url = "http://localhost:3000/cbc/iv",
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

function addPadding(plaintext) {
  assert(
    plaintext.length <= 16,
    `Plaintext block exceeds 16 bytes (${plaintext.length})`
  );

  const pad = 16 - plaintext.length;
  const sourceBuffer = Buffer.from(plaintext);
  const targetBuffer = pad > 0 ? Buffer.alloc(16, pad) : Buffer.alloc(32, 16);
  sourceBuffer.copy(targetBuffer, 0, 0);

  return targetBuffer.toString("hex");
}

function increment(bigint, addend = 1, offset = 12) {
  assert(Number.isSafeInteger(addend), "Addend not a safe integer");

  if (offset < 0) return;

  const current = bigint.readUInt32BE(offset);
  const sum = current + addend;

  if (sum <= MAX_32_INTEGER) {
    return bigint.writeUInt32BE(sum, offset);
  }

  const reminder = sum % (MAX_32_INTEGER + 1);
  const carry = Math.floor(sum / MAX_32_INTEGER);

  bigint.writeUInt32BE(reminder, offset);
  increment(bigint, carry, offset - 4);
}

async function main() {
  var text = await axios.get("http://localhost:3000/wordlist.txt");
  var textByLine = text.data.split("\r\n");

  var number_of_words = textByLine.length;

  const response = await axios.get("http://localhost:3000/cbc/iv/challenge");
  console.log(response.data.ciphertext);
  var victim_ctxt = response.data.ciphertext;
  var victim_iv = response.data.iv;

  let first = await queryCryptoOracle({
    plaintext: textByLine[0]
  });

  let first_iv = first.iv;

  var first_iv_next = first_iv;
  let first_iv_next_buff = Buffer.from(first_iv_next, "hex");
  increment(first_iv_next_buff, 4);
  first_iv_next = first_iv_next_buff.toString("hex");
  let i = 0;

  while (i < number_of_words) {
    let iv_buff = Buffer.from(victim_iv, "hex");
    let iv_buff_next = Buffer.from(first_iv_next, "hex");

    let word_of_choice = textByLine[i];
    let afterpadd = addPadding(word_of_choice);
    buff_word = Buffer.from(afterpadd, "hex");

    let result = Buffer.alloc(16);

    for (let j = 0; j < result.length; j++) {
      result[j] = iv_buff[j] ^ buff_word[j] ^ iv_buff_next[j];
    }

    plaintext1 = result.toString("hex");

    let response1 = await queryCryptoOracle({
      plaintext: plaintext1
    });

    var ciphertext_a = response1.ciphertext;
    var ciphertext_new = ciphertext_a.slice(0, 32);

    if (victim_ctxt == ciphertext_new) {
      console.log("Trazena rijec: " + textByLine[i]);
      i = number_of_words;
    } else {
      increment(first_iv_next_buff, 4);
      first_iv_next = first_iv_next_buff.toString("hex");
      i++;
    }
  }
}

main();
