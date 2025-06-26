# Smart Traffic Lights

The server-side of an IoT application that is responsible for data-stream management
and smart controlling in interactions with traffic lights with AI’s support.

# MVP Demo

This is a demo video for the application's MVP version (in Vietnamese): __[STL Demo](https://drive.google.com/file/d/1Q9zThPTqJ1zxIC204JCydWJwcMbAupbh/view?usp=drive_link)__.

# Project setup for development

## Dependencies instalation

Run this command when you pull the remote repository to your local.

```bash
npm install
```

## Docker running

If you have installed Docker, you can host your database via the container that is already set up.

Run the Docker container for database hosting.

```bash
docker compose up dev-db -d
```

## Environment setup

Create your own `.env` file.

### Database URL

If you have Docker, you can run the container and paste this line into your `.env` file

```yml
DATABASE_URL="postgresql://postgres:1@localhost:5434/STL"
```

If not, you can create your own database and assign its URL to the `DATABASE_URL` variable.

## Adafruit keys

Create your Adafruit account at [Adafruit](https://io.adafruit.com/), featch your user name and your key then insert it into the `.env` file

```yml
ADAFRUIT_USERNAME=<Your user name>
ADAFRUIT_KEY=<Your key>
```

## Other vairables

You can set the application port that you want it to run on, if not, the default is `3000`.

```yml
PORT=<Your port>
```

You have to give a secret for `JWT` authentication, for example `secret`.

```yml
JWT_SECRET=<Your secret>
```

Finally, assign the URL of Ngork which forwards to the service that the AI model runs on.

```yml
NGROK_DOMAIN="https://enjoyed-stirring-pegasus.ngrok-free.app"
```

Please ensure that the model are running when you want to use the image processing feature.

# Project run

Run all shells in this Google Colab project to start the AI model service [Vehicle counting model](https://colab.research.google.com/drive/1ZdHq3sXMsDoRB4c-70j_Un3oKDWbtwkl?usp=sharing#scrollTo=gTBU2RLNf3BD).

To run the application, use this command

```bash
npm run start:dev
```