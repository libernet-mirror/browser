## Prerequisites

You need [Node.js](https://nodejs.org/), [Rust](https://www.rust-lang.org/), and [`wasm-bindgen-cli`](https://crates.io/crates/wasm-bindgen-cli).

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
