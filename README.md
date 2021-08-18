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
docker run -it --mount src=`pwd`,target=/app,type=bind spar-scrapper
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
