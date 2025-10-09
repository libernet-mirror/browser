## Prerequisites

You need [Node.js](https://nodejs.org/), [Rust](https://www.rust-lang.org/), and
[`wasm-bindgen-cli`](https://crates.io/crates/wasm-bindgen-cli).

## Building and Running

The following assumes the root of this repo is the current working directory.

To build the Rust [`crypto` library](https://github.com/libernet-mirror/crypto), first move into the
`crypto` subdirectory and use `cargo`:

```sh
browser$ cd crypto
browser/crypto$ cargo build --target wasm32-unknown-unknown --release
```

Optionally run the tests (**before** `cargo build`):

```sh
browser/crypto$ cargo test
```

Then generate the JavaScript bindings:

```sh
browser/crypto$ wasm-bindgen target/wasm32-unknown-unknown/release/crypto.wasm --out-dir ../crypto-bindings/ --target bundler
```

Now you can move back to the root and run the full app:

```sh
browser/crypto$ cd ..
browser$ npm start
```

The final native binary is built with:

```sh
browser$ npm run package
```

## Updating Submodules

```sh
browser$ git submodules foreach git pull
```

If there have been changes to the `crypto` submodule you need to rebuild it as described above.

If there have been changes to the `proto` submodule you'll need to regenerate the message types in
`src/proto/`. We use the `proto-loader-gen-types` script provided with
[`@grpc/proto-loader`](https://www.npmjs.com/package/@grpc/proto-loader), which needs to be run
manually:

```sh
browser$ ./node_modules/@grpc/proto-loader/build/bin/proto-loader-gen-types.js \
    --keepCase \
    --longs=String \
    --enums=String \
    --defaults \
    --oneofs \
    --grpcLib=@grpc/grpc-js \
    --outDir=src/proto/ \
    proto/*.proto
```

The generated files need to be committed to version control.
