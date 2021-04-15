## Rate Demo

### Assumptions
I've made some of the following assumptions (probably some more too)
* The input can contain lines with different delimiters
* Delimiters that contain other delimiters will have higher precedence
* Run on node 12+ environment

### About
Lines are processed via streams to support disparate sources and destinations.
They are loaded into a light weight in memory db to support full featured sorting with fewer lines of code but also since it would be a natural api integration in a real project anyway. Tests (with coverage) can be run by the following
```
npm run test:coverage
```
The tests are automatically run on push to master and the results have an automated build in aws with the results visible [here](https://master.d21vfv5vhizjve.amplifyapp.com/)

### Usage 
#### ClI
ensure that node 12+ is installed.
```
npm ci
npx ts-node cli --help
```

Example usages
```
npx ts-node cli < /path/to/files > out-file