/*
 *
 * Copyright 2023 gRPC authors.
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

import process from 'node:process'
import parseArgs from 'npm:minimist';
import grpc from 'npm:@grpc/grpc-js';
import protoLoader from 'npm:@grpc/proto-loader';
import { fromFileUrl } from "https://deno.land/std@0.203.0/path/mod.ts";
const  PROTO_PATH = fromFileUrl(import.meta.resolve('../protos/echo.proto'));

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true
  });
const echoProto = grpc.loadPackageDefinition(packageDefinition).grpc.examples.echo;

const STREAMING_COUNT = 10;

function unaryCallWithMetadata(client, message) {
  return new Promise((resolve, reject) => {
    console.log('--- unary ---');
    const requestMetadata = new grpc.Metadata();
    requestMetadata.set('timestamp', new Date().toISOString());
    const call = client.unaryEcho({message}, requestMetadata, (error, value) => {
      if (error) {
        console.log(`Received error ${error}`);
        return;
      }
      console.log('Response:');
      console.log(`- ${JSON.stringify(value)}`);
    });
    call.on('metadata', metadata => {
      const timestamps = metadata.get('timestamp');
      if (timestamps.length > 0) {
        console.log('timestamp from header:');
        for (const [index, value] of timestamps.entries()) {
          console.log(` ${index}. ${value}`);
        }
      } else {
        console.error("timestamp expected but doesn't exist in header");
      }
      const locations = metadata.get('location');
      if (locations.length > 0) {
        console.log('location from header:');
        for (const [index, value] of locations.entries()) {
          console.log(` ${index}. ${value}`);
        }
      } else {
        console.error("location expected but doesn't exist in header");
      }
    });
    call.on('status', status => {
      const timestamps = status.metadata.get('timestamp');
      if (timestamps.length > 0) {
        console.log('timestamp from trailer:');
        for (const [index, value] of timestamps.entries()) {
          console.log(` ${index}. ${value}`);
        }
      } else {
        console.error("timestamp expected but doesn't exist in trailer");
      }
      resolve();
    });
  });
}

function serverStreamingWithMetadata(client, message) {
  return new Promise((resolve, reject) => {
    console.log('--- server streaming ---');
    const requestMetadata = new grpc.Metadata();
    requestMetadata.set('timestamp', new Date().toISOString());
    const call = client.serverStreamingEcho({message}, requestMetadata);
    call.on('metadata', metadata => {
      const timestamps = metadata.get('timestamp');
      if (timestamps.length > 0) {
        console.log('timestamp from header:');
        for (const [index, value] of timestamps.entries()) {
          console.log(` ${index}. ${value}`);
        }
      } else {
        console.error("timestamp expected but doesn't exist in header");
      }
      const locations = metadata.get('location');
      if (locations.length > 0) {
        console.log('location from header:');
        for (const [index, value] of locations.entries()) {
          console.log(` ${index}. ${value}`);
        }
      } else {
        console.error("location expected but doesn't exist in header");
      }
    });
    call.on('data', value => {
      console.log(`Received response ${JSON.stringify(value)}`);
    });
    call.on('status', status => {
      const timestamps = status.metadata.get('timestamp');
      if (timestamps.length > 0) {
        console.log('timestamp from trailer:');
        for (const [index, value] of timestamps.entries()) {
          console.log(` ${index}. ${value}`);
        }
      } else {
        console.error("timestamp expected but doesn't exist in trailer");
      }
      resolve();
    });
    call.on('error', error => {
      console.log(`Received error ${error}`);
    });
  });
}

function clientStreamingWithMetadata(client, message) {
  return new Promise((resolve, reject) => {
    console.log('--- client streaming ---');
    const requestMetadata = new grpc.Metadata();
    requestMetadata.set('timestamp', new Date().toISOString());
    const call = client.clientStreamingEcho(requestMetadata, (error, value) => {
      if (error) {
        console.log(`Received error ${error}`);
        return;
      }
      console.log('Response:');
      console.log(`- ${JSON.stringify(value)}`);
    });
    call.on('metadata', metadata => {
      const timestamps = metadata.get('timestamp');
      if (timestamps.length > 0) {
        console.log('timestamp from header:');
        for (const [index, value] of timestamps.entries()) {
          console.log(` ${index}. ${value}`);
        }
      } else {
        console.error("timestamp expected but doesn't exist in header");
      }
      const locations = metadata.get('location');
      if (locations.length > 0) {
        console.log('location from header:');
        for (const [index, value] of locations.entries()) {
          console.log(` ${index}. ${value}`);
        }
      } else {
        console.error("location expected but doesn't exist in header");
      }
    });
    call.on('status', status => {
      const timestamps = status.metadata.get('timestamp');
      if (timestamps.length > 0) {
        console.log('timestamp from trailer:');
        for (const [index, value] of timestamps.entries()) {
          console.log(` ${index}. ${value}`);
        }
      } else {
        console.error("timestamp expected but doesn't exist in trailer");
      }
      resolve();
    });
    for (let i = 0; i < STREAMING_COUNT; i++) {
      call.write({message});
    }
    call.end();
  });
}

function bidirectionalWithMetadata(client, message) {
  return new Promise((resolve, reject) => {
    console.log('--- bidirectional ---');
    const requestMetadata = new grpc.Metadata();
    requestMetadata.set('timestamp', new Date().toISOString());
    const call = client.bidirectionalStreamingEcho(requestMetadata);
    call.on('metadata', metadata => {
      const timestamps = metadata.get('timestamp');
      if (timestamps.length > 0) {
        console.log('timestamp from header:');
        for (const [index, value] of timestamps.entries()) {
          console.log(` ${index}. ${value}`);
        }
      } else {
        console.error("timestamp expected but doesn't exist in header");
      }
      const locations = metadata.get('location');
      if (locations.length > 0) {
        console.log('location from header:');
        for (const [index, value] of locations.entries()) {
          console.log(` ${index}. ${value}`);
        }
      } else {
        console.error("location expected but doesn't exist in header");
      }
    });
    call.on('data', value => {
      console.log(`Received response ${JSON.stringify(value)}`);
    });
    call.on('status', status => {
      const timestamps = status.metadata.get('timestamp');
      if (timestamps.length > 0) {
        console.log('timestamp from trailer:');
        for (const [index, value] of timestamps.entries()) {
          console.log(` ${index}. ${value}`);
        }
      } else {
        console.error("timestamp expected but doesn't exist in trailer");
      }
      resolve();
    });
    call.on('error', error => {
      console.log(`Received error ${error}`);
    });
    for (let i = 0; i < STREAMING_COUNT; i++) {
      call.write({message});
    }
    call.end();
  });
}

function asyncWait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

const message = 'this is examples/metadata';

async function main() {
  let argv = parseArgs(process.argv.slice(2), {
    string: 'target',
    default: {target: 'localhost:50052'}
  });
  const client = new echoProto.Echo(argv.target, grpc.credentials.createInsecure());
  await unaryCallWithMetadata(client, message);
  await asyncWait(1000);

  await serverStreamingWithMetadata(client, message);
  await asyncWait(1000);

  await clientStreamingWithMetadata(client, message);
  await asyncWait(1000);

  await bidirectionalWithMetadata(client, message);
  client.close();
}

main();
