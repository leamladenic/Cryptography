# **Kriptografija i mrežna sigurnost**

## Lokalno pokretanje  _crypto oracle_ servera

> Pripremio: **Mateo Fuzul**

U ovom poglavlju nalaze se upute pokretanje _crypto oracle_ REST servera na lokalnom računalu.

1. Potrebno je klonirati repozitorij kako slijedi: `git clone https://github.com/mcagalj/CNS-2019-20.git`, te ući u direktorij projekta sa `cd CNS-2019-20/crypto-oracle/`.

2. Unutar navedenog direktorija nalazi se datoteka `package.json` u kojoj se nalazi popis modula/skripti potrebnih za pokretanje servera. Kako bi instalirali potrebne module pokrenite naredbu `npm install`.

3. Nakon što su svi moduli instalirani server se pokreće naredbom `npm start` (u istom direktoriju u kojem se nalazi i datoteka `package.json`). Serveru se može pristupiti unutar browsera na adresi `localhost:3000`.

4. Svi parametri koje server koristi za genriranje kriptografskih izazova (vicevi,_cookie_-ji, tajne riječi, javni i privatni ključevi, i sl.) definirani su u datoteci `.env`.

5. Drugi konfiguracijski parametri važni za pokretanje servera (npr., port) definirani su u datoteci `config\config.js`. U slučaju da vam je predefinirani port 3000 zauzet na lokalnom računalu, u ovoj konfiguracijskoj datoteci možete definirati neki drugi slobodni port (npr. 3001, 8000 i sl.).
