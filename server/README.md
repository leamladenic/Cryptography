# **Kriptografija i mrežna sigurnost**

## FESB, Računarstvo, 2019/20

U okviru laboratorijskih vježbi student će se upoznati s praktičnim aspektima postupka zaštite podataka na mreži primjenom kriptografskih mehanizama.

Laboratorijske vježbe su praktičnog tipa (_hands-on_). Vježbe su djelomično inspirirane modelom _capture the flag_, gdje student prikuplja kredit rješavanjem odgovarajućih kriptografskih izazova (_challenge_). U okviru vježbi student treba otkriti način na koji može otključati/dekriptirati svoj _challenge_ (kratak tekst koji uključuje [Chuck Norrisa](http://www.nochucknorris.com)). 

Student će dobiti pristup personaliziranom virtualnom serveru (REST API aplikacija pisana u [Express](https://expressjs.com) _framework_-u i koja se izvodi u odgovarajućem [Docker](https://www.docker.com) _container_-u). U interakciji sa osobnim serverom student će rješavati dane kriptografske izazove.

U ovom repozitoriju profesor će objavljivati upute, dijelove koda, konfiguracijske skripte, i druge sugestije vezane uz predmet a sa svrhom povećanja produktivnosti studenta tijekom rada na laboratorijskim vježbama.

> **Rješenja s labova (uključujući i odgovarajuće izvorne kodove) student će spremati na lokalni Git server**. U okviru laba, za ove potrebe, koristimo _open source_ sustav za upravljanje projektima [GitLab](https://about.gitlab.com).

## Popis vježbi

- [Lab 1 - ARP spoofing](/instructions/lab-1.md)
- [Lab 2 - ECB mode vulnerabilities](/instructions/lab-2.md)
- Lab 3 - CBC mode and predictable initialization vectors (IV)
- Lab 4 - CTR mode and repeated IVs/counter
- Lab 5 - Asymmetric crypto: RSA signatures and DH key exchange
- Lab 6 - Securing end-2-end communication
- Lab 7 - Certificate authorities (CAs) and TLS protocol
- Lab 8 - SSH tunneling
  
### Dodatne upute

- [Git basics](/instructions/lab-0.md)
- [Running the REST server (_crypto oracle_) locally](/instructions/intro.md)
