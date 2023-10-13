This is the static code generation variant of the Hello World. Code in these examples is pre-generated using protoc and the Node gRPC protoc plugin, and the generated code can be found in various `*_pb.js` files. The command line sequence for generating those files is as follows (assuming that `protoc` and `grpc_node_plugin` are present, and starting in the directory which contains this README.md file):

```sh
npm list -g --depth=0
# 网络必须能访问https://node-precompiled-binaries.grpc.io/grpc-tools/v1.x.x/win32-x64.tar.gz
npm i --unsafe-perm -g grpc-tools
# 无网络,步骤1
npm i --unsafe-perm -g grpc-tools --ignore-scripts
# 无网络,步骤2 通过https://d.serctl.com/下载 bin解压到node_modules\grpc-tools\bin
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./static_codegen/ --grpc_out=grpc_js:./static_codegen/ ./protos/helloworld.proto
# 执行上面命令不成功，原因未知
```
