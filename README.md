# SOUR Source Code Repo

## Description
This is the Primary repository for the SOUR 🍋 E-Commerce and Social media Application

## Starting our application

**pre-requesites**
- docker desktop or docker daemon installed on device 
- mobile application with expo installed 

1. in your terminal at the root directory of this project build the docker sour docker image with `docker compose -f dev-compose.yaml build`
2.`docker compose -f dev-compose.yaml up`
3. once built you will need to remote into the docker container this can be done in one of two ways: 

**Remote explorer in visual studio code** 
requires the remote explorer extension to be installed 
- click on the remote explorer icons and click on the dropdown and select Dev Containers
- click on the -> next to the `sour` container(this will attach the container in the current window) 
- open up a terminal 
- enter the command `./start-project.sh` 

**Terminal**
- run the following command `docker exec -it sour-dev-1 bash -c "./start-project.sh"


4. Enter the IP address of your host machine 
5. scan the QR code
