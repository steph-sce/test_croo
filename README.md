# Tchat
## Test technique Croo

Cloner le dépot.

> git clone https://github.com/steph28/test_croo.git

## Lancement du projet

__*Partie SQL*__

> Créer la database tchat avec psql
```sql
CREATE DATABASE <nom de la base> OWNER <nom du owner>;
```

> Créer les tables user et comment
```sql
CREATE TABLE "user" (
   id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   name VARCHAR(100) NOT NULL,
   email VARCHAR(100) NOT NULL
);

CREATE TABLE comment (
   id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   user_comment VARCHAR(255) NOT NULL,
   date_comment TIMESTAMPTZ DEFAULT NOW(),
   user_id INT NOT NULL REFERENCES "user"(id)
);
```

__*Partie front et back*__

Installation des dépendances et lancement du front

```sh
cd client
npm i
npm start
```

Installation des dépendances et lancement du back

```sh
cd server
npm i
npm start
```
