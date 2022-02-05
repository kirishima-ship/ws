<div align="center">

![Kirishima Banner](https://cdn.discordapp.com/attachments/891939988088975372/931079377771450388/kirishima-ship-banner.png)

# @kirishima/ws

</div>

# Instalation 
```
npm install @kirishima/ws ws @sapphire/async-queue
```

# Features
- Written in TypeScript
- Support ESM & CommonJS

# Example 
```ts
import { Gateway } from "@kirishima/ws";

(async () => {
    const lavalinkSocket = new Gateway("ws://lava.link:80")
    .setClientId("12345678901234")
    .setClientName("@kirishima/ws lavalink websocket implementation")
    .setAuthorization("youshallnotpass")

    lavalinkSocket.on("open", () => {
        console.log("Lavalink connected !")
    })

    await lavalinkSocket.connect();

})()