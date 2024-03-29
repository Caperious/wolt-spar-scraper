# Spar online shop scrapper

A scrapper the for Spar online shop, which scrapes basic information about the products.

## Info

For the application to run, there must be a `Spar.xlsx` file present in the current directory. The scrapper reads the file, and takes the first column as the column with the
product ids. These products are parsed and saved into a file `spar_produkti.xlsx`.

## Docker commands

### Building an image
```shell
docker build -t spar-scrapper .
```
### Running an image
This command binds the current volume to the application. This is needed because the Spar.xlsx file must be present in this folder, for the scraper to be
able to read which products to visit. v
```shell
docker run -it -v ${PWD}/spar_excel:/app/spar_excel spar-scrapper
```

You can manually set the pause between requests, the default wait time between is 1seconds (60 requests / minute)
```shell
docker run -it -v ${PWD}/spar_excel:/app/spar_excel -e REQUESTS_PER_MINUTE=30 spar-scrapper 
```

## Running locally

### Installing the packages
```shell
npm install
```

### Building the application
```shell
nest build
```

### Running the application
```shell
nest start
```


**Author: David Rudman, dvd.rudman@gmail.com**
