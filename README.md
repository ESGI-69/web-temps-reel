# Web Temps Réel

## Contributions de l'équipe
- Quentin Peltier (timdev0) : Création de quizz et de questions
- Gatien ANIZAN (mrpinkcat) : Creation de room, init du projet, des bases de données et des sockets
- Samuel GUENIER (sguenier) : Création de room, rejoindre/quitter une room, limite d'utilisateurs + mot de passe sur une room
- Yohan CENTANNI (ycenta) : Création de room, init des socket

## Mise en prod

### Création du namespace

```bash
kubectl apply -f kubernetes/namespace.yaml
```

...

### Création du secret

## Developpement

### Lancement de l'application

#### Frontend

##### Installation des dépendances

```bash
npm install
```

##### Lancement de l'application

```bash
npm run dev
```

#### Backend

##### Installation des dépendances

```bash
npm install
```

##### Lancement de l'application

```bash
npm run dev
```

#### Bases de données

##### Lancement des bases de données

```bash
docker-compose up postgres mongo
```

### Exécution des migrations

```bash
npx sequelize-cli db:migrate
```

### Création d'une migration

```bash
npx sequelize-cli migration:create --name migration-name
```

> Remplacer `migration-name` par le nom de la migration

/!\ Ne pas oublier de modifier le fichier de migration créé dans le dossier `migrations` pour ajouter les instructions SQL nécessaires.

/!\ Ne pas oublier de modifier l'extention du fichier de migration par `.cjs` pour que les migrations soient exécutées correctement.
