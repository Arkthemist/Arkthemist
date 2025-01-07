# Eliza

## Install the dependencies

```bash
pnpm install
```

## Build the project

```bash
pnpm build
```

## Update env variables

Create env file

```bash
cp .env.examples .env
```

Get an api token in together ai platform and paste on env variable
```bash
OPENAI_API_KEY=<secret_token>
```

Also describe the model that you are going to use in env varible

```bash
XAI_MODEL=meta-llama/Llama-3.3-70B-Instruct-Turbo
```

Also need to update Starknet related variables

```bash
STARKNET_ADDRESS=
STARKNET_PRIVATE_KEY=
```
with the data from your own starknet wallet.

## Install dependencies and start your agent

```bash
pnpm i && pnpm start
```
Note: this requires node to be at least version 22 when you install packages and run the agent.

## Test the agent
You can communicate with it using postman or using the pre build client of eliza (download eliza directly and follow build instructions and finally run pnpm start:client)