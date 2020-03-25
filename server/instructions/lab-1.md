# **Kriptografija i mrežna sigurnost - Lab 1**

## ARP spoofing attack

U okviru vježbe upoznajemo se s osnovnim sigurnosnim prijetnjama i ranjivostima u računalnim mrežama. Analizirat ćemo ranjivost _Address Resolution Protocol_-a (ARP) koja napadaču omogućava izvođenje _man in the middle_ i _denial of service_ napada na računala u istom LAN-u.

<p align="center">
<img src="../img/arp-request.png" width="550px" height="auto"/>
<br>
<em>ARP Request</em>
</p>
<br>
<p align="center">
<img src="../img/arp-reply.png" width="550px" height="auto"/>
<br>
<em>ARP Reply</em>
</p>
<br>
<p align="center">
<img src="../img/arp-spoofing.png" width="550px" height="auto"/>
<br>
<em>ARP Spoofing</em>
</p>

Zadatak studenta je dešifrirati tekst/šalau/vic enkriptiran _AES šifrom u CBC enkripcijskom modu (AES-CBC)_; navedene kratice i terminologija vam u ovom trenutku možda ne znače previše, no s vremenom će sve _sjesti na svoje mjesto_.

Ključ koji je potreban za dekripciju student treba otkriti u interakciji s odgovarajućim serverom (kojeg kolokvijalno zovemo **_crypto oracle_**). Šifrirani tekst/šalu/vic student može dohvatiti preko REST API-ja koji je detaljno dokumentiran na serveru.

Student zadatak rješava u nekoliko koraka:

1. Otkrijte IP adresu vlastitog virtualnog servera. Za ovo iskoristite činjnicu da dani centralni server periodično šalje korisne informacije u obliku _multicast_ paketa na podmreži `10.0.0.0/20`.
   
    > NAPOMENA: Računalima/serverima se dodjeljuju dinamičke IP adrese (putem DHCP servera). Stoga je IP adresa studentovog servera podložna promjenama.

2. Centralni server periodično šalje studentovom serveru `GET` zahtjeve na `/arp` (_unicast_ paketi). Studentov server po primitku ovog zahtjeva odgovara centralnom serveru s tajnim _cookie_-jem. Komunikacija između centralnog i studentovog servera ide u _čisto_ (nije zaštićena) ali preko mrežnog prespojnika (_network switch_). _Switch_ izolira promet između pojedinih računala; drugim rječima, _unicast_ pakete između dva računala vide samo računalo koje ih šalje i računalo kojem su paketi namjenjeni.

   ARP _spoofing_ napad omogućava napadaču preusmjeravanje _unicast_ prometa preko napadačevog računala.

   Iskoristite ranjivost ARP protokola i izvršite ARP _spoofing_ napad (_Kali Linux_), te otkrijte tajni _cookie_.

3. Dohvatite šifrirani tekst s virtualnog servera slanjem `GET` zahtjeva na `/arp/challenge`.

    Na osnovu _cookie_-ija otkrivenog u prethodnom koraku izvedite dekripcijski ključ. Ključ se izvodi primjenom _[Password-Based Key Derivation Function 2](https://en.wikipedia.org/wiki/PBKDF2)_ (`PBKDF2`). Parametre `PBKDF2` funkcije koji su korišteni za izvođenje ključa možete vidjeti u skripti `pbkdf2-promise.js` dostupnoj u direkoriju [crypto-oracle/crypto_modules](/crypto-oracle/crypto_modules). S ispravnim dekripcijskim ključem možete rješiti izazov u okviru ove vježbe - dekriptirati šifrirani tekst/vic.

    Generalno, za izvođenje dekripcijskog ključa kao i za samu dekripciju šifriranog teksta možete koristiti nekakvu _crypto_ biblioteku u programskom jeziku po želji ili čak _online_ servis koji implementira PBKDF2 i AEC-CBC.

    > Naša preporuka je pak da za navedene zadaće koristite Node.js skriptu `cryptor.js` koja se nalazi u direktoriju [crypto-oracle/crypto_modules](/crypto-oracle/crypto_modules).

    1. Kopirajte skriptu `cryptor.js` na lokalno računalo.

    2. U kodu prilagodite parametre: ubacite svoj _cookie_, šifrirani tekst (_ciphertext_), te inicijalizacijski vektor (_iv_) u naznačena mjesta u _decryptor_-u kako je prikazano u primjeru u nastavku.

        > Terminologija vam u ovom trenutku možda izgleda konfuzno i nejasno, obećavamo s vremenom će sve _sjesti na svoje mjesto_.

        ```js
        //-------------------------------------
        // Decryptor with 'aes-256-cbc'
        //-------------------------------------
        (async () => {
        try {
            const mode = "aes-256-cbc";
            const key = await pbkdf2({ cookie: "zelursirronkcuhc" });
            const iv = Buffer.from("711324d3dc0ab9508f551f327111ddb9", "hex");
            const ciphertext =
            "8e2f59bd9114d626d65a738d1b7860d09e491fff39b120b9c91c49b3b91292153b7642eb440f983104f2ca73bda213f3";

            const plaintext = decrypt({ mode, iv, key, ciphertext });

            console.log("Decryptor: %o", plaintext);
        } catch (err) {
            console.error(err);
        }
        })();
        ```

    3. Konačno, pokrenite skriptu kao `node cryptor.js`. Uživajte u dešifriranom vicu i podijelite ga s drugima.

Profesori će biti na raspolaganju za sva vaša pitanja i eventualne nedoumice.
