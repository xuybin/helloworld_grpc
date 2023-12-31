/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import grpc from 'npm:@grpc/grpc-js';
import protoLoader from 'npm:@grpc/proto-loader';
import grpc_xds from 'npm:@grpc/grpc-js-xds';
import process from 'node:process'
import parseArgs from 'npm:minimist';
import { fromFileUrl } from "https://deno.land/std@0.203.0/path/mod.ts";
const  PROTO_PATH = fromFileUrl(import.meta.resolve('../protos/helloworld.proto'));

grpc_xds.register();

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

function main() {
  var argv = parseArgs(process.argv.slice(2), {
    string: 'target'
  });
  var target;
  if (argv.target) {
    target = argv.target;
  } else {
    target = 'localhost:50051';
  }
  var client = new hello_proto.Greeter(target,
                                       grpc.credentials.createInsecure());
  var user;
  if (argv._.length > 0) {
    user = argv._[0];
  } else {
    user = 'world';
  }
  client.sayHello({name: user}, function(err, response) {
    if (err) throw err;
    console.log('Greeting:', response.message);
    client.close();
  });
}

main();
