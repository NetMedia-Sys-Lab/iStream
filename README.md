# iStream: A Flexible Container-based Multimedia Stream Application Testbed

The iStream research platform was designed to ad-
dress the fragmented state of multimedia streaming
research.

## How to build?

To start using the iStream platform you need to build the front-end and back-end separately.

```bash
cd istream-backend
npm install
```


```bash
cd istream-frontend
npm install
```

Then you need to install the jq(JSON processor) package in your system:
```bash
#For MAC OS
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" < /dev/null 2> /dev/null
brew install jq

#For Linux
sudo apt-get update
sudo apt-get install jq
```

## How to run?

For running the iStream platform you should run the front-end and back-end separately.

```bash
cd istream-backend
npm start
```

```bash
cd istream-frontend
npm start
```

Then the back0end will be run on port 8888 on localhost and the front-end most likely on port 3000, and you can access them in your browser on [localhost](http://localhost:3000)

## How it works?

Now you can use the iStream platform to add your modules or use the default modules and configure your experiment and iStream will run it for you and you can download the results.