## Rate Demo

### Assumptions
I've made some of the following assumptions (probably some more too)
* The input can contain lines with different delimiters
* Delimiters that contain other delimiters will have higher precedence
* white space around delimiters in requirements is significant
* Run on node 12+ environment
* stand alone server is a server that runs without the use of another like express or hapi 
* the api "sort by name" implies lastname, firstname
* test coverage is targeting statements

### About
Lines are processed via streams to support disparate sources and destinations.
They are loaded into a light weight in memory db to support full featured sorting with fewer lines of code but also since it would be a natural api integration in a real project anyway. Tests (with coverage) can be run by the following
```bash
npm run test:coverage
```
The tests are automatically run on push to master and the results have an automated build in aws with the results visible [here](https://master.d21vfv5vhizjve.amplifyapp.com/)

### Usage 
#### ClI
ensure that node 12+ is installed.
```bash
$ npm ci
$  npx ts-node cli --help
```

```bash
$ npx ts-node cli < /path/to/files > out-file
Outpput 1
$ npx ts-node cli < /path/to/files -s gender:asc lastName:asc
Output 2
$ npx ts-node cli < /path/to/files -s dob:asc
Output 3
$ npx ts-node cli < /path/to/files -s lastName:desc
```

Example usages and scenerios from assignment
#### Generate an example file

```bash
$ npx ts-node src/generator.ts -l 100

```

#### Combined
```bash
$ npx ts-node src/generator.ts -l 100 | npx ts-node cli -s gender:asc -f csv
```
## Server
to run the server 
```bash
$ npx ts-node src/server/index.ts
```

### Undone
list of things I didn't quite get to. \
organizing code better \
using fixtures or generators for csv lines in tests\
use interface for some routing stuff to make workign with them easier\
let user pass a flag to specify the output format desired